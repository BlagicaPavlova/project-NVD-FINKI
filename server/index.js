import express from 'express'
import cors from 'cors'
import pg from 'pg'

const app = express()

app.use(cors())
app.use(express.json())

const pool = new pg.Pool({
    user: 'blagicapavlova',
    host: 'localhost',
    database: 'soundflow',
    port: 5432
})

app.get('/api/labels', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT *
            FROM labels
            ORDER BY rank ASC
        `)

        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

app.get('/api/labels/:id', async (req, res) => {
    try {
        const labelResult = await pool.query(
            'SELECT * FROM labels WHERE id = $1',
            [req.params.id]
        )

        if (labelResult.rows.length === 0) {
            return res.status(404).json({ error: 'Label not found' })
        }

        const releasesResult = await pool.query(`
            SELECT
                r.id,
                r.title,
                r.featured_artists,
                r.release_date,
                r.artwork,
                r.pr_text,
                COALESCE(
                    json_agg(a.name) FILTER (WHERE a.id IS NOT NULL),
                    '[]'
                ) AS artists
            FROM releases r
            LEFT JOIN release_artists ra ON r.id = ra.release_id
            LEFT JOIN artists a ON ra.artist_id = a.id
            WHERE r.label_id = $1
            GROUP BY r.id
            ORDER BY r.release_date DESC
        `, [req.params.id])

        res.json({
            ...labelResult.rows[0],
            releases: releasesResult.rows
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

app.get('/api/releases', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                r.id,
                r.title,
                r.featured_artists,
                r.release_date,
                r.artwork,
                r.pr_text,
                l.id AS label_id,
                l.name AS label_name,
                COALESCE(
                    json_agg(a.name) FILTER (WHERE a.id IS NOT NULL),
                    '[]'
                ) AS artists
            FROM releases r
            JOIN labels l ON r.label_id = l.id
            LEFT JOIN release_artists ra ON r.id = ra.release_id
            LEFT JOIN artists a ON ra.artist_id = a.id
            GROUP BY r.id, l.id, l.name
            ORDER BY r.release_date DESC
        `)

        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

app.get('/api/releases/:id', async (req, res) => {
    try {
        const releaseResult = await pool.query(`
            SELECT
                r.id,
                r.title,
                r.featured_artists,
                r.release_date,
                r.artwork,
                r.pr_text,
                l.id AS label_id,
                l.name AS label_name,
                COALESCE(
                    json_agg(DISTINCT a.name) FILTER (WHERE a.id IS NOT NULL),
                    '[]'
                ) AS artists
            FROM releases r
            JOIN labels l ON r.label_id = l.id
            LEFT JOIN release_artists ra ON r.id = ra.release_id
            LEFT JOIN artists a ON ra.artist_id = a.id
            WHERE r.id = $1
            GROUP BY r.id, l.id, l.name
        `, [req.params.id])

        if (releaseResult.rows.length === 0) {
            return res.status(404).json({ error: 'Release not found' })
        }

        const versionsResult = await pool.query(`
            SELECT type, label, src
            FROM release_versions
            WHERE release_id = $1
            ORDER BY id ASC
        `, [req.params.id])

        const otherAppearancesResult = await pool.query(`
            SELECT
                r2.id,
                r2.title,
                r2.release_date,
                r2.artwork,
                r2.pr_text,
                l2.id AS label_id,
                l2.name AS label_name,
                COALESCE(
                    json_agg(a2.name) FILTER (WHERE a2.id IS NOT NULL),
                    '[]'
                ) AS artists
            FROM releases r
            JOIN release_artists ra ON r.id = ra.release_id
            JOIN release_artists ra2 ON ra.artist_id = ra2.artist_id
            JOIN releases r2 ON ra2.release_id = r2.id
            JOIN labels l2 ON r2.label_id = l2.id
            LEFT JOIN release_artists ra3 ON r2.id = ra3.release_id
            LEFT JOIN artists a2 ON ra3.artist_id = a2.id
            WHERE r.id = $1
            AND r2.id != $1
            GROUP BY r2.id, l2.id, l2.name
        `, [req.params.id])

        res.json({
            ...releaseResult.rows[0],
            versions: versionsResult.rows,
            otherAppearances: otherAppearancesResult.rows
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
})