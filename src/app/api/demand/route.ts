import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET() {
  try {
    const requests = await prisma.demandRequest.findMany({
      where: { 
        status: {
          in: ['active', 'matched']
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Demand API GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demand requests' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'walletAddress', 'cpuCores', 'gpuCount', 'ramGB', 
      'storageGB', 'maxPricePerHour', 'duration'
    ];
    
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

    if (isNaN(data.maxPricePerHour) || data.maxPricePerHour < 0.01 || data.maxPricePerHour > 1000) {
      return NextResponse.json(
        { error: 'Max price per hour must be between $0.01 and $1000' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(data.duration) || data.duration < 1 || data.duration > 8760) {
      return NextResponse.json(
        { error: 'Duration must be between 1 and 8760 hours' },
        { status: 400 }
      );
    }

    // Validate wallet address format
    if (!data.walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Validate job description length if provided
    if (data.jobDescription && data.jobDescription.length > 500) {
      return NextResponse.json(
        { error: 'Job description must be 500 characters or less' },
        { status: 400 }
      );
    }

    const demandRequest = await prisma.demandRequest.create({
      data: {
        walletAddress: data.walletAddress,
        cpuCores: data.cpuCores,
        gpuCount: data.gpuCount,
        gpuType: data.gpuType || null,
        ramGB: data.ramGB,
        storageGB: data.storageGB,
        maxPricePerHour: data.maxPricePerHour,
        duration: data.duration,
        jobDescription: data.jobDescription || null,
        status: 'active'
      }
    });

    return NextResponse.json(demandRequest, { status: 201 });
  } catch (error) {
    console.error('Demand API POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create demand request' }, 
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
        { error: 'Demand request ID is required' },
        { status: 400 }
      );
    }

    // Validate status if provided
    const validStatuses = ['active', 'matched', 'completed', 'cancelled'];
    if (data.status && !validStatuses.includes(data.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') },
        { status: 400 }
      );
    }

    const updatedRequest = await prisma.demandRequest.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.maxPricePerHour && { maxPricePerHour: data.maxPricePerHour })
      }
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Demand API PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update demand request' },
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
        { error: 'Demand request ID is required' },
        { status: 400 }
      );
    }

    await prisma.demandRequest.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Demand API DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete demand request' },
      { status: 500 }
    );
  }
}