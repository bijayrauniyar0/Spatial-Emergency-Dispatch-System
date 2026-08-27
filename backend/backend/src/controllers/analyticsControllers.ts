import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import sequelize from '../config/database';

interface AnalyticsFilters {
  from?: string;
  to?: string;
}

export const getAnalytics = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { from, to } = req.query as AnalyticsFilters;

    const fromDate = from ? new Date(from) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to) : new Date();

    const summaryResults = await sequelize.query(
      `SELECT
        COUNT(*) as total_incidents,
        COUNT(CASE WHEN status IN ('PENDING', 'RESPONDING', 'ARRIVED') THEN 1 END) as active_incidents,
        ROUND(AVG(EXTRACT(EPOCH FROM (accepted_at - created_at))))::INTEGER as avg_dispatch_seconds,
        ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - created_at))))::INTEGER as avg_resolution_seconds
      FROM incidents
      WHERE created_at >= :fromDate AND created_at <= :toDate`,
      {
        replacements: { fromDate, toDate },
        type: QueryTypes.SELECT
      },
    );

    const summary = summaryResults.length > 0 ? summaryResults[0] : {};

    const volumeByDay = await sequelize.query(
      `SELECT
        DATE(created_at) as date,
        COUNT(*) as count
      FROM incidents
      WHERE created_at >= :fromDate AND created_at <= :toDate
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC`,
      {
        replacements: { fromDate, toDate },
        type: QueryTypes.SELECT
      },
    );

    const byCategory = await sequelize.query(
      `SELECT
        category,
        COUNT(*) as count
      FROM incidents
      WHERE created_at >= :fromDate AND created_at <= :toDate
      GROUP BY category
      ORDER BY count DESC`,
      {
        replacements: { fromDate, toDate },
        type: QueryTypes.SELECT
      },
    );

    const byStation = await sequelize.query(
      `SELECT
        s.id as station_id,
        s.name as station_name,
        COUNT(i.id) as count,
        ROUND(AVG(EXTRACT(EPOCH FROM (i.updated_at - i.created_at))))::INTEGER as avg_resolution_seconds
      FROM stations s
      LEFT JOIN incidents i ON s.id = i.station_id AND i.created_at >= :fromDate AND i.created_at <= :toDate
      GROUP BY s.id, s.name
      ORDER BY count DESC`,
      {
        replacements: { fromDate, toDate },
        type: QueryTypes.SELECT
      },
    );

    const byResponder = await sequelize.query(
      `SELECT
        r.id as responder_id,
        u.email as responder_name,
        COUNT(CASE WHEN i.responder_id IS NOT NULL THEN 1 END) as claimed,
        COUNT(CASE WHEN i.status = 'RESOLVED' THEN 1 END) as resolved,
        ROUND(AVG(EXTRACT(EPOCH FROM (i.updated_at - i.created_at))))::INTEGER as avg_resolution_seconds
      FROM responders r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN incidents i ON r.id = i.responder_id AND i.created_at >= :fromDate AND i.created_at <= :toDate
      GROUP BY r.id, u.email
      ORDER BY claimed DESC`,
      {
        replacements: { fromDate, toDate },
        type: QueryTypes.SELECT
      },
    );

    res.json({
      summary,
      volumeByDay,
      byCategory,
      byStation,
      byResponder,
      period: { from: fromDate.toISOString(), to: toDate.toISOString() },
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
