export const metadata = {
  title: 'Cek Rekening Bank',
  description: 'Aplikasi validasi rekening bank Indonesia',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
        {children}
      </body>
    </html>
  );
}