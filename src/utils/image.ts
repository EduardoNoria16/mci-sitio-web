export function getProxiedImageUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('data:')) return url;
  if (url.startsWith('blob:')) return url;
  if (url.startsWith('/')) return url; // local paths stay local!
  
  // if url is static local asset, logo base64, or an ibb.co direct image
  if (!url.includes('http://') && !url.includes('https://') && !url.includes('imgbox.')) {
    return url;
  }
  
  if (url.includes('ibb.co')) {
    return url;
  }

  
  // if url already has wsrv.nl or weserv.nl, normalize it
  if (url.includes('wsrv.nl') || url.includes('weserv.nl')) {
    const cleanUrl = url.replace(/^https?:\/\/(images\.)?weserv\.nl\/\?url=/, '')
                         .replace(/^https?:\/\/wsrv\.nl\/\?url=/, '')
                         .replace(/^(https?:\/\/)?/, '');
    return `https://images.weserv.nl/?url=https://${cleanUrl}`;
  }

  // Ensure fully qualified clean URL passed to weserv
  const cleanUrl = url.replace(/^(https?:\/\/)?/, '');
  return `https://images.weserv.nl/?url=https://${cleanUrl}`;
}
