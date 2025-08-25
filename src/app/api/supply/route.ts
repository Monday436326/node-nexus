import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET() {
  try {
    const offers = await prisma.supplyOffer.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(offers);
  } catch (error) {
    console.error('Supply API GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch supply offers' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['walletAddress', 'cpuCores', 'gpuCount', 'ramGB', 'storageGB', 'pricePerHour'];
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate data types and ranges
    if (!Number.isInteger(data.cpuCores) || data.cpuCores < 1 || data.cpuCores > 128) {
      return NextResponse.json(
        { error: 'CPU cores must be between 1 and 128' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(data.gpuCount) || data.gpuCount < 0 || data.gpuCount > 16) {
      return NextResponse.json(
        { error: 'GPU count must be between 0 and 16' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(data.ramGB) || data.ramGB < 1 || data.ramGB > 1024) {
      return NextResponse.json(
        { error: 'RAM must be between 1 and 1024 GB' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(data.storageGB) || data.storageGB < 1 || data.storageGB > 10000) {
      return NextResponse.json(
        { error: 'Storage must be between 1 and 10000 GB' },
        { status: 400 }
      );
    }

    if (isNaN(data.pricePerHour) || data.pricePerHour < 0.01 || data.pricePerHour > 1000) {
      return NextResponse.json(
        { error: 'Price per hour must be between $0.01 and $1000' },
        { status: 400 }
      );
    }

    // Validate wallet address format (basic check)
    if (!data.walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    const offer = await prisma.supplyOffer.create({
      data: {
        walletAddress: data.walletAddress,
        cpuCores: data.cpuCores,
        gpuCount: data.gpuCount,
        gpuType: data.gpuType || null,
        ramGB: data.ramGB,
        storageGB: data.storageGB,
        pricePerHour: data.pricePerHour,
        location: data.location || null,
        available: true
      }
    });

    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error('Supply API POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create supply offer' }, 
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Supply offer ID is required' },
        { status: 400 }
      );
    }

    const updatedOffer = await prisma.supplyOffer.update({
      where: { id },
      data: {
        available: data.available,
        pricePerHour: data.pricePerHour,
        ...(data.location && { location: data.location })
      }
    });

    return NextResponse.json(updatedOffer);
  } catch (error) {
    console.error('Supply API PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update supply offer' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Supply offer ID is required' },
        { status: 400 }
      );
    }

    await prisma.supplyOffer.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Supply API DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete supply offer' },
      { status: 500 }
    );
  }
}