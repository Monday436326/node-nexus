/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let whereClause = {};
    
    if (walletAddress) {
      // Get transactions for matches involving this wallet address
      const matches = await prisma.match.findMany({
        where: {
          OR: [
            { supplyOffer: { walletAddress } },
            { demandRequest: { walletAddress } }
          ]
        },
        select: { id: true }
      });
      
      const matchIds = matches.map((match: { id: any; }) => match.id);
      whereClause = {
        matchId: { in: matchIds }
      };
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        match: {
          include: {
            supplyOffer: true,
            demandRequest: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    const total = await prisma.transaction.count({ where: whereClause });

    return NextResponse.json({
      transactions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Transactions API GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { matchId, txHash, amount, token = 'USDC', status = 'pending' } = await request.json();
    
    if (!matchId || !txHash || !amount) {
      return NextResponse.json(
        { error: 'matchId, txHash, and amount are required' },
        { status: 400 }
      );
    }

    // Validate transaction hash format
    if (!txHash.match(/^0x[a-fA-F0-9]{64}$/)) {
      return NextResponse.json(
        { error: 'Invalid transaction hash format' },
        { status: 400 }
      );
    }

    // Check if transaction already exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { txHash }
    });

    if (existingTransaction) {
      return NextResponse.json(
        { error: 'Transaction with this hash already exists' },
        { status: 400 }
      );
    }

    // Verify match exists
    const match = await prisma.match.findUnique({
      where: { id: matchId }
    });

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        matchId,
        txHash,
        amount,
        token,
        status
      }
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Transactions API POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}