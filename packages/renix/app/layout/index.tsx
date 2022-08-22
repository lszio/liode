import { Link } from "@remix-run/react";

export function Layout({ children, ...props }: any) {
  return (
    <div className="flex flex-col min-h-screen text-center bg-slate-50">
      <div className="header h-10 flex flex-row">
        <span>RENIX</span>
        <div className="flex-grow">
          <Link to="/">Home</Link>
          <Link to="/games/reaction-speed">ReactionSpeed</Link>
        </div>
        <div>Search</div>
      </div>
      <div className="flex flex-row flex-grow">
        <div className="left">left</div>
        <div className="main flex-grow">{children}</div>
        <div className="right">right</div>
      </div>
      <div className="footer" >footer</div>
    </div>
  )
}
