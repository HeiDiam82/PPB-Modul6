import { pool } from "../config/database.js";

function normalize(row) {
  if (!row) return row;
  return {
    ...row,
    value: row.value === null ? null : Number(row.value),
  };
}

function assertValidValue(value) {
  if (
    typeof value !== "number" ||
    Number.isNaN(value) ||
    !Number.isFinite(value)
  ) {
    throw new Error("value must be a number");
  }
}

export const ThresholdsModel = {
  async list(options = {}) {
    const page = Math.max(1, parseInt(options.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(options.limit, 10) || 10));
    const offset = (page - 1) * limit;

    const [dataResult, countResult] = await Promise.all([
      pool.query(
        `SELECT id, value, note, created_at
         FROM public.threshold_settings
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      pool.query(`SELECT COUNT(*)::int AS total FROM public.threshold_settings`),
    ]);

    const total = countResult.rows[0]?.total ?? 0;
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: dataResult.rows.map(normalize),
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  },

  async latest() {
    const { rows } = await pool.query(
      `SELECT id, value, note, created_at
       FROM public.threshold_settings
       ORDER BY created_at DESC
       LIMIT 1`
    );
    return normalize(rows[0] ?? null);
  },

  async create(payload) {
    const { value, note } = payload ?? {};
    assertValidValue(value);

    const { rows } = await pool.query(
      `INSERT INTO public.threshold_settings (value, note)
       VALUES ($1, $2)
       RETURNING id, value, note, created_at`,
      [value, note?.slice(0, 180) ?? null]
    );
    return normalize(rows[0]);
  },
};
