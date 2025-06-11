// routes/ventas.js
const express = require('express');
const router = express.Router();
const pool = require('../model/pool');

function getStartDate(range) {
    const now = new Date();
    switch (range) {
        case '7d': return new Date(now.setDate(now.getDate() - 6));
        case '14d': return new Date(now.setDate(now.getDate() - 13));
        case '30d': return new Date(now.setDate(now.getDate() - 29));
        case '3m': return new Date(now.setMonth(now.getMonth() - 2));
        case '6m': return new Date(now.setMonth(now.getMonth() - 5));
        case 'ytd': return new Date(now.getFullYear(), 0, 1);
        default: return new Date(now.setDate(now.getDate() - 6));
    }
}

router.get('/', async (req, res) => {
    const { range = '7d' } = req.query;
    const startDate = getStartDate(range);
    console.log('startDate:', startDate);

    try {
        // Gráfico de línea: ventas por fecha
        const ventasPorFecha = await pool.query(`
            SELECT
                DATE(m.fecha) AS fecha,
                SUM(v.total) AS total
            FROM movimiento m
            JOIN movimiento_venta v ON m.id_movimiento = v.id_movimiento
            WHERE m.tipo = 'Venta' AND m.fecha >= $1
            GROUP BY DATE(m.fecha)
            ORDER BY fecha
        `, [startDate]);

        const labels = ventasPorFecha.rows.map(row => row.fecha);
        const data = ventasPorFecha.rows.map(row => Number(row.total));

        // Gráfico de pastel: total por categoría
        const categorias = await pool.query(`
            SELECT 
                c.nombre AS categoria,
                SUM(pm.subtotal) AS total
            FROM categoria c
            JOIN producto p ON c.id_categoria = p.id_categoria
            JOIN producto_movimiento pm ON p.id_producto = pm.id_producto
            JOIN movimiento m ON m.id_movimiento = pm.id_movimiento
            WHERE m.tipo = 'Venta' AND m.fecha >= $1
            GROUP BY c.nombre
            ORDER BY total DESC
        `, [startDate]);

        const categoriaLabels = categorias.rows.map(row => row.categoria);
        const categoriaData = categorias.rows.map(row => Number(row.total));

        // Retornar ambos datasets
        res.json({
            ventas: { labels, data },
            categorias: { labels: categoriaLabels, data: categoriaData }
        });

    } catch (error) {
        console.error('Error al obtener datos del dashboard:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
