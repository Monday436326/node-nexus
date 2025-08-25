/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { matchSupplyAndDemand } from '../../../lib/matching';

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      include: {
        supplyOffer: true,
        demandRequest: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(matches);
  } catch (error) {
    console.error('Match API GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { demandRequestId, supplyOfferId } = await request.json();
    
    if (!demandRequestId || !supplyOfferId) {
      return NextResponse.json(
        { error: 'Both demandRequestId and supplyOfferId are required' },
        { status: 400 }
      );
    }
    
    // Fetch demand request and supply offer
    const [demandRequest, supplyOffer] = await Promise.all([
      prisma.demandRequest.findUnique({ 
        where: { id: demandRequestId } 
      }),
      prisma.supplyOffer.findUnique({ 
        where: { id: supplyOfferId } 
      })
    ]);

    if (!demandRequest) {
      return NextResponse.json(
        { error: 'Demand request not found' }, 
        { status: 404 }
      );
    }

    if (!supplyOffer) {
      return NextResponse.json(
        { error: 'Supply offer not found' }, 
        { status: 404 }
      );
    }

    if (!supplyOffer.available) {
      return NextResponse.json(
        { error: 'Supply offer is no longer available' }, 
        { status: 400 }
      );
    }

    if (demandRequest.status !== 'active') {
      return NextResponse.json(
        { error: 'Demand request is no longer active' }, 
        { status: 400 }
      );
    }

    // Verify compatibility
    const isCompatible = 
      supplyOffer.cpuCores >= demandRequest.cpuCores &&
      supplyOffer.gpuCount >= demandRequest.gpuCount &&
      supplyOffer.ramGB >= demandRequest.ramGB &&
      supplyOffer.storageGB >= demandRequest.storageGB &&
      supplyOffer.pricePerHour <= demandRequest.maxPricePerHour &&
      (!demandRequest.gpuType || !supplyOffer.gpuType || supplyOffer.gpuType === demandRequest.gpuType);

    if (!isCompatible) {
      return NextResponse.json(
        { error: 'Supply offer is not compatible with demand request' },
        { status: 400 }
      );
    }

    // Create match in a transaction
    const result = await prisma.$transaction(async (prisma: { match: { create: (arg0: { data: { supplyOfferId: any; demandRequestId: any; agreedPrice: any; status: string; }; }) => any; }; supplyOffer: { update: (arg0: { where: { id: any; }; data: { available: boolean; }; }) => any; }; demandRequest: { update: (arg0: { where: { id: any; }; data: { status: string; }; }) => any; }; }) => {
      // Create the match
      const match = await prisma.match.create({
        data: {
          supplyOfferId,
          demandRequestId,
          agreedPrice: supplyOffer.pricePerHour,
          status: 'pending'
        }
      });

      // Update supply availability
      await prisma.supplyOffer.update({
        where: { id: supplyOfferId },
        data: { available: false }
      });

      // Update demand status
      await prisma.demandRequest.update({
        where: { id: demandRequestId },
        data: { status: 'matched' }
      });

      return match;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Match API POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create match' }, 
      { status: 500 }
    );
  }
}