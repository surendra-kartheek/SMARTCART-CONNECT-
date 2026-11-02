import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return <main className="page-shell"><div className="empty-state not-found"><span className="eyebrow">404 · Page not found</span><h1>Looks like this aisle is empty.</h1><p>The page may have moved or the link may be incorrect.</p><Link className="button button-dark" to="/"><ArrowLeft size={16} /> Return home</Link></div></main>;
}
