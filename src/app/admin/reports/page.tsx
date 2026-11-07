import { requireAdmin } from "@/lib/admin";
import { formatRupiah } from "@/lib/format";

type ReportData = {
  sales?: number;
  hpp?: number;
  gross_profit?: number;
  order_count?: number;
  daily?: { date: string; sales: number }[];
  monthly?: { month: string; sales: number }[];
  best_sellers?: { name: string; quantity: number }[];
};

const statusLabels: Record<string, string> = {
  new: "Baru",
  processing: "Diproses",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export default async function ReportsPage() {
  const { supabase } = await requireAdmin();
  const [{ data: reportData, error: reportError }, { data: transactions, error: transactionError }] = await Promise.all([
    supabase.rpc("admin_reports"),
    supabase
      .from("orders")
      .select("id,order_number,customer_name,customer_whatsapp,status,grand_total,created_at,order_items(product_name_snapshot,color_name_snapshot,quantity,personalized,personalization_name,line_total)")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);
  const report = reportData as ReportData | null;

  return <>
    <header className="admin-page-heading">
      <div><p className="eyebrow">ANALISIS</p><h1>Laporan</h1></div>
      <p>Zona waktu Asia/Jakarta</p>
    </header>

    {reportError && <p role="alert">Laporan gagal dimuat: {reportError.message}</p>}
    {!reportError && <div className="admin-stat-grid">
      <article><span>Total penjualan · pesanan selesai</span><strong>{formatRupiah(report?.sales ?? 0)}</strong></article>
      <article><span>Total HPP produk</span><strong>{formatRupiah(report?.hpp ?? 0)}</strong></article>
      <article><span>Laba kotor · penjualan − HPP</span><strong>{formatRupiah(report?.gross_profit ?? 0)}</strong></article>
      <article><span>Jumlah pesanan selesai</span><strong>{report?.order_count ?? 0}</strong></article>
    </div>}

    {!reportError && <section className="admin-panel" aria-labelledby="gross-profit-formula">
      <h2 id="gross-profit-formula">Cara menghitung laba kotor</h2>
      <p><strong>Laba kotor = total penjualan pesanan selesai − total HPP produk pesanan selesai.</strong></p>
      <p>Penjualan memakai total pesanan yang mencakup biaya personalisasi yang dibayar pelanggan. HPP memakai snapshot harga modal produk dikali jumlah unit saat pesanan dibuat. Biaya personalisasi tidak ditambahkan ke HPP. Angka ini adalah laba kotor, bukan laba bersih; biaya kemasan, cetak, dan operasional tidak dihitung.</p>
    </section>}

    {!reportError && <section className="admin-panel">
      <h2>Ringkasan harian</h2>
      {report?.daily?.length ? <div className="admin-table-wrap"><table><thead><tr><th>Tanggal</th><th>Penjualan pesanan selesai</th></tr></thead><tbody>{report.daily.map((row) => <tr key={row.date}><td>{row.date}</td><td>{formatRupiah(row.sales)}</td></tr>)}</tbody></table></div> : <p>Belum ada pesanan selesai untuk diringkas.</p>}
    </section>}

    {!reportError && <section className="admin-panel">
      <h2>Ringkasan bulanan</h2>
      {report?.monthly?.length ? <div className="admin-table-wrap"><table><thead><tr><th>Bulan</th><th>Penjualan pesanan selesai</th></tr></thead><tbody>{report.monthly.map((row) => <tr key={row.month}><td>{row.month}</td><td>{formatRupiah(row.sales)}</td></tr>)}</tbody></table></div> : <p>Belum ada pesanan selesai untuk diringkas.</p>}
    </section>}

    {!reportError && <section className="admin-panel">
      <h2>Produk terlaris</h2>
      {report?.best_sellers?.length ? <ol>{report.best_sellers.map((row) => <li key={row.name}>{row.name} · {row.quantity} unit</li>)}</ol> : <p>Belum ada data produk dari pesanan selesai.</p>}
    </section>}

    <section className="admin-panel">
      <h2>Riwayat transaksi</h2>
      {transactionError && <p role="alert">Riwayat transaksi gagal dimuat: {transactionError.message}</p>}
      {!transactionError && transactions?.length ? <>
        <p className="admin-help">Menampilkan maksimal 100 pesanan terbaru dari semua status.</p>
        <div className="admin-card-list">{transactions.map((order) => <article className="admin-card" key={order.id}>
          <div className="admin-card-main">
            <h3>{order.order_number} · {order.customer_name}</h3>
            <p>{order.customer_whatsapp} · {new Date(order.created_at).toLocaleString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "medium", timeStyle: "short" })}</p>
            <span className={`admin-status${order.status === "completed" ? " active" : ""}`}>{statusLabels[order.status] ?? order.status}</span>
            <ul>{order.order_items.map((item, index) => <li key={`${order.id}-${index}`}>
              {item.product_name_snapshot} · {item.color_name_snapshot} × {item.quantity}{item.personalized ? ` · Personalisasi: ${item.personalization_name}` : ""} · {formatRupiah(item.line_total)}
            </li>)}</ul>
            <strong>Total: {formatRupiah(order.grand_total)}</strong>
          </div>
        </article>)}</div>
      </> : !transactionError ? <p>Belum ada transaksi.</p> : null}
    </section>
  </>;
}
