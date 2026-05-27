export function Footer() {
  return (
    <footer className="border-t border-black/[0.06] px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-[#ff6600] text-xs font-bold text-white">
            E
          </span>
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Elenchus
          </span>
        </div>
        <p className="font-serif text-sm italic text-muted-foreground">
          An AI VC that breaks your pitch to make it better.
        </p>
      </div>
    </footer>
  );
}
