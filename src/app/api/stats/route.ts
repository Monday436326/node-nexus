import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET() {
  try {
    const [
      totalSupplyOffers,
      availableSupply,
      totalDemandRequests,
      activeDemand,
      totalMatches,
      totalTransactions,
      totalVolume
    ] = await Promise.all([
      prisma.supplyOffer.count(),
      prisma.supplyOffer.count({ where: { available: true } }),
      prisma.demandRequest.count(),
      prisma.demandRequest.count({ where: { status: 'active' } }),
      prisma.match.count(),
      prisma.transaction.count({ where: { status: 'confirmed' } }),
      prisma.transaction.aggregate({
        where: { status: 'confirmed' },
        _sum: { amount: true }
      })
    ]);

    // Get average pricing
    const avgSupplyPrice = await prisma.supplyOffer.aggregate({
      where: { available: true },
      _avg: { pricePerHour: true }
    });

    const avgDemandPrice = await prisma.demandRequest.aggregate({
      where: { status: 'active' },
      _avg: { maxPricePerHour: true }
    });

    // Get recent activity (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentActivity = await Promise.all([
      prisma.supplyOffer.count({
        where: { createdAt: { gte: yesterday } }
      }),
      prisma.demandRequest.count({
        where: { createdAt: { gte: yesterday } }
      }),
      prisma.match.count({
        where: { createdAt: { gte: yesterday } }
      })
    ]);

    const stats = {
      supply: {
        total: totalSupplyOffers,
        available: availableSupply,
        recent: recentActivity[0],
        averagePrice: avgSupplyPrice._avg.pricePerHour || 0
      },
      demand: {
        total: totalDemandRequests,
        active: activeDemand,
        recent: recentActivity[1],
        averageMaxPrice: avgDemandPrice._avg.maxPricePerHour || 0
      },
      matches: {
        total: totalMatches,
        recent: recentActivity[2]
      },
      transactions: {
        total: totalTransactions,
        totalVolume: totalVolume._sum.amount || 0
      },
      marketplace: {
        utilizationRate: availableSupply > 0 ? (totalMatches / availableSupply) * 100 : 0,
        averageMatchTime: 0, // Could be calculated from match creation times
        networkHealth: availableSupply > 0 && activeDemand > 0 ? 'healthy' : 'low_activity'
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marketplace statistics' },
      { status: 500 }
    );
  }
}