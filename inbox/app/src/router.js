export const go = (view, arg) => { location.hash = arg ? `/${view}/${encodeURIComponent(arg)}` : view === 'inbox' ? '' : `/${view}` }
export const back = () => { if (history.length > 1 && location.hash) history.back(); else go('inbox') }
