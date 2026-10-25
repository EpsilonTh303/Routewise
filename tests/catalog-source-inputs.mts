/** Preserve dated evidence while turning repository nullable columns into import inputs. */
export function sourceInputs(record:{sources:{url:string;title:string|null;evidence:string|null;checkedAt:string|null}[]}) {
  return record.sources.map(source=>({url:source.url,...(source.title?{title:source.title}:{}),...(source.evidence?{evidence:source.evidence}:{}),checkedAt:source.checkedAt}));
}
