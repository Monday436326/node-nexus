/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const match = await prisma.match.findUnique({
      where: { id: params.id },
      include: {
        supplyOffer: true,
        demandRequest: true
      }
    });

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(match);
  } catch (error) {
    console.error('Match API GET by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { txHash, status } = await request.json();
    
    if (!params.id) {
      return NextResponse.json(
        { error: 'Match ID is required' },
        { status: 400 }
      );
    }

    // Validate status if provided
    const validStatuses = ['pending', 'active', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') },
        { status: 400 }
      );
    }

    // Validate transaction hash format if provided
    if (txHash && !txHash.match(/^0x[a-fA-F0-9]{64}$/)) {
      return NextResponse.json(
        { error: 'Invalid transaction hash format' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (prisma: { match: { update: (arg0: { where: { id: string; }; data: any; }) => any; }; transaction: { findUnique: (arg0: { where: { txHash: any; }; }) => any; create: (arg0: { data: { matchId: string; txHash: any; amount: any; token: string; status: string; }; }) => any; }; demandRequest: { update: (arg0: { where: { id: any; } | { id: any; }; data: { status: string; } | { status: string; }; }) => any; }; supplyOffer: { update: (arg0: { where: { id: any; }; data: { available: boolean; }; }) => any; }; }) => {
      // Update the match
      const match = await prisma.match.update({
        where: { id: params.id },
        data: {
          ...(txHash && { txHash }),
          ...(status && { status })
        }
      });

      // If transaction hash is provided and status is active, create transaction record
      if (txHash && status === 'active') {
        const existingTransaction = await prisma.transaction.findUnique({
          where: { txHash }
        });

        if (!existingTransaction) {
          await prisma.transaction.create({
            data: {
              matchId: params.id,
              txHash,
              amount: match.agreedPrice,
              token: 'USDC',
              status: 'confirmed'
            }
          });
        }
      }

      // If match is completed, update demand request status
      if (status === 'completed') {
        await prisma.demandRequest.update({
          where: { id: match.demandRequestId },
          data: { status: 'completed' }
        });
      }

      // If match is cancelled, restore supply availability and demand status
      if (status === 'cancelled') {
        await Promise.all([
          prisma.supplyOffer.update({
            where: { id: match.supplyOfferId },
            data: { available: true }
          }),
          prisma.demandRequest.update({
            where: { id: match.demandRequestId },
            data: { status: 'active' }
          })
        ]);
      }

      return match;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Match API PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json(
        { error: 'Match ID is required' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (prisma: { match: { findUnique: (arg0: { where: { id: string; }; }) => any; delete: (arg0: { where: { id: string; }; }) => any; }; supplyOffer: { update: (arg0: { where: { id: any; }; data: { available: boolean; }; }) => any; }; demandRequest: { update: (arg0: { where: { id: any; }; data: { status: string; }; }) => any; }; }) => {
      // Get the match first
      const match = await prisma.match.findUnique({
        where: { id: params.id }
      });

      if (!match) {
        throw new Error('Match not found');
      }

      // Delete the match
      await prisma.match.delete({
        where: { id: params.id }
      });

      // Restore supply availability and demand status
      await Promise.all([
        prisma.supplyOffer.update({
          where: { id: match.supplyOfferId },
          data: { available: true }
        }),
        prisma.demandRequest.update({
          where: { id: match.demandRequestId },
          data: { status: 'active' }
        })
      ]);

      return { success: true };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Match API DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete match' },
      { status: 500 }
    );
  }
}