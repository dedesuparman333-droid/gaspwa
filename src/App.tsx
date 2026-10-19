import React, { useState, useEffect, useRef } from 'react';
import {
  FileCode,
  SlidersHorizontal,
  Copy,
  Download,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  Smartphone,
  Sparkles,
  Info
} from 'lucide-react';

type IconType = 'url' | 'text' | 'image';

export default function App() {
  // Form State
  const [appUrl, setAppUrl] = useState(
    'https://script.google.com/macros/s/AKfycbwRMgTWzMfUhkwJSNlV84ecoLJ8w1j79qOIt5GhvWRkrQA7fEfsy5uXanVYqmaGI569CA/exec'
  );
  const [appName, setAppName] = useState('Toko Online');
  const [shortName, setShortName] = useState('Toko');
  const [appDesc, setAppDesc] = useState(
    'Toko online - katalog produk dan keranjang belanja'
  );
  const [themeColor, setThemeColor] = useState('#E63946');
  const [bgColor, setBgColor] = useState('#1A1A2E');
  const [iconType, setIconType] = useState<IconType>('url');
  const [iconUrl, setIconUrl] = useState('');
  const [iconText, setIconText] = useState('T');

  // Custom Local Image State (WebP Base64)
  const [customIcon192Src, setCustomIcon192Src] = useState<string | null>(null);
  const [customIcon512Src, setCustomIcon512Src] = useState<string | null>(null);

  // XML Output State
  const [xmlOutput, setXmlOutput] = useState('');
  const [xmlSizeKb, setXmlSizeKb] = useState('0.0');

  // Active Icons State
  const [activeIcon192, setActiveIcon192] = useState('');
  const [activeIcon512, setActiveIcon512] = useState('');
  const [activeIconExt, setActiveIconExt] = useState('svg');

  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Guide modal or accordion
  const [showGuide, setShowGuide] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger Toast Notification
  const triggerToast = (msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    setShowToast(true);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 3200);
  };

  // Helper: Convert string to Base64 (supporting Unicode safely)
  const base64Encode = (str: string): string => {
    return btoa(unescape(encodeURIComponent(str)));
  };

  // Generate SVG String
  const createSVG = (
    size: number,
    bg: string,
    textColor: string,
    text: string
  ): string => {
    const fontSize = size === 192 ? 90 : 240;
    const yPos = size === 192 ? 120 : 320;
    const center = size / 2;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="${bg}"/><text x="${center}" y="${yPos}" font-size="${fontSize}" fill="${textColor}" text-anchor="middle" font-family="sans-serif" font-weight="bold">${text}</text></svg>`;
  };

  // Calculate size in KB
  const calculateSize = (str: string): string => {
    const sizeInBytes = new Blob([str]).size;
    return (sizeInBytes / 1024).toFixed(1);
  };

  // Handle local image upload and WebP compression
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize to 192x192 with WebP compression
        const canvas192 = document.createElement('canvas');
        canvas192.width = 192;
        canvas192.height = 192;
        const ctx192 = canvas192.getContext('2d');
        if (ctx192) {
          ctx192.drawImage(img, 0, 0, 192, 192);
          const data192 = canvas192.toDataURL('image/webp', 0.8);
          setCustomIcon192Src(data192);
        }

        // Resize to 512x512 with WebP compression
        const canvas512 = document.createElement('canvas');
        canvas512.width = 512;
        canvas512.height = 512;
        const ctx512 = canvas512.getContext('2d');
        if (ctx512) {
          ctx512.drawImage(img, 0, 0, 512, 512);
          const data512 = canvas512.toDataURL('image/webp', 0.8);
          setCustomIcon512Src(data512);
        }

        triggerToast('Logo berhasil dikompresi ke format WebP ringan!');
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  // Generate Template Effect
  useEffect(() => {
    const url = appUrl || '#';
    const name = appName || 'Aplikasi';
    const sName = shortName || 'App';
    const desc = appDesc || '';
    const theme = themeColor;
    const bg = bgColor;
    const effectiveText = iconText || name.charAt(0) || 'T';

    let icon192FinalSrc = '';
    let icon512FinalSrc = '';
    let iconMimeType = 'image/png';

    if (iconType === 'url') {
      const fallbackIcon = `data:image/svg+xml;base64,${base64Encode(
        createSVG(512, bg, theme, effectiveText || '?')
      )}`;
      const extUrl = iconUrl.trim() || fallbackIcon;
      icon192FinalSrc = extUrl;
      icon512FinalSrc = extUrl;
      iconMimeType = iconUrl.trim() ? 'image/png' : 'image/svg+xml';
    } else if (iconType === 'text') {
      const svg192 = createSVG(192, bg, theme, effectiveText);
      const svg512 = createSVG(512, bg, theme, effectiveText);
      icon192FinalSrc = `data:image/svg+xml;base64,${base64Encode(svg192)}`;
      icon512FinalSrc = `data:image/svg+xml;base64,${base64Encode(svg512)}`;
      iconMimeType = 'image/svg+xml';
    } else {
      // Local image
      if (customIcon192Src && customIcon512Src) {
        icon192FinalSrc = customIcon192Src;
        icon512FinalSrc = customIcon512Src;
        iconMimeType = 'image/webp';
      } else {
        const svg192 = createSVG(192, bg, theme, '?');
        const svg512 = createSVG(512, bg, theme, '?');
        icon192FinalSrc = `data:image/svg+xml;base64,${base64Encode(svg192)}`;
        icon512FinalSrc = `data:image/svg+xml;base64,${base64Encode(svg512)}`;
        iconMimeType = 'image/svg+xml';
      }
    }

    setActiveIcon192(icon192FinalSrc);
    setActiveIcon512(icon512FinalSrc);
    setActiveIconExt(
      iconMimeType === 'image/svg+xml'
        ? 'svg'
        : iconMimeType === 'image/webp'
        ? 'webp'
        : 'png'
    );

    // Generate Manifest JSON & Encode
    const manifestObj = {
      name: name,
      short_name: sName,
      description: desc,
      start_url: '/',
      display: 'standalone',
      background_color: bg,
      theme_color: theme,
      orientation: 'portrait-primary',
      icons: [
        {
          src: icon192FinalSrc,
          sizes: '192x192',
          type: iconMimeType,
          purpose: 'any maskable',
        },
        {
          src: icon512FinalSrc,
          sizes: '512x512',
          type: iconMimeType,
          purpose: 'any maskable',
        },
      ],
    };
    const b64_manifest = base64Encode(JSON.stringify(manifestObj));

    // Generate Blogger XML Template
    const xmlTemplate = `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:css='false' b:defaultwidgetversion='2' b:layoutsversion='3' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/namespaces/gae/2008' xmlns:data='http://www.google.com/namespaces/atom' xmlns:expr='http://www.google.com/namespaces/all/0.8'>
<head>
    <title><data:blog.pageTitle/></title>
    <meta content='width=device-width,initial-scale=1,viewport-fit=cover' name='viewport'/>

    <!-- PWA Manifest -->
    <link href='data:application/manifest+json;base64,${b64_manifest}' rel='manifest'/>

    <!-- Meta tag PWA tambahan -->
    <meta content='${theme}' name='theme-color'/>
    <meta content='yes' name='mobile-web-app-capable'/>
    <meta content='yes' name='apple-mobile-web-app-capable'/>
    <meta content='black-translucent' name='apple-mobile-web-app-status-bar-style'/>
    <meta content='${sName}' name='apple-mobile-web-app-title'/>
    <link href='${icon192FinalSrc}' rel='apple-touch-icon'/>

    <b:skin><![CDATA[
        /* Reset tampilan agar fullscreen */
        body {
            margin: 0;
            padding: 0;
            overflow: hidden; 
            background-color: #ffffff;
        }
        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
        }
    ]]></b:skin>
</head>
<body>
    <iframe 
        allow='camera; microphone; display-capture; autoplay' 
        src='${url}' />
    <b:section id='main' showaddelement='no'>
        <b:widget id='Blog1' locked='true' title='Blog Posts' type='Blog' visible='false'/>
    </b:section>
</body>
</html>`;

    setXmlOutput(xmlTemplate);
    setXmlSizeKb(calculateSize(xmlTemplate));
  }, [
    appUrl,
    appName,
    shortName,
    appDesc,
    themeColor,
    bgColor,
    iconType,
    iconUrl,
    iconText,
    customIcon192Src,
    customIcon512Src,
  ]);

  // Copy Action
  const handleCopy = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(xmlOutput)
        .then(() => {
          triggerToast('Kode XML berhasil disalin ke clipboard!');
        })
        .catch(() => copyFallback(xmlOutput));
    } else {
      copyFallback(xmlOutput);
    }
  };

  const copyFallback = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      triggerToast('Kode XML berhasil disalin ke clipboard!');
    } catch {
      triggerToast('Gagal menyalin otomatis, silakan copy manual.');
    }
    textArea.remove();
  };

  // Download Action
  const handleDownloadXml = () => {
    const sName = shortName.trim() || 'App';
    const fileName = `theme-${sName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')}.xml`;

    const blob = new Blob([xmlOutput], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      triggerToast(`File ${fileName} berhasil didownload!`);
    }, 0);
  };

  // Download Individual Icon
  const handleDownloadIcon = (size: 192 | 512) => {
    const src = size === 192 ? activeIcon192 : activeIcon512;
    if (!src || src.startsWith('http')) {
      triggerToast('Hanya berfungsi untuk gambar lokal / Base64.');
      return;
    }
    const sName = shortName.trim() || 'App';
    const fileName = `icon-${sName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')}-${size}x${size}.${activeIconExt}`;

    const a = document.createElement('a');
    a.href = src;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    triggerToast(`Ikon ukuran ${size}x${size} berhasil didownload!`);
  };

  const numericSize = parseFloat(xmlSizeKb) || 0;
  const isLarge = numericSize > 100;
  const isMedium = numericSize > 30 && numericSize <= 100;

  return (
    <div className="bg-dark text-gray-200 min-h-screen font-sans antialiased selection:bg-primary selection:text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-darker border-b border-gray-800 py-3 px-4 sm:px-6 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <FileCode className="w-7 h-7 sm:w-8 sm:h-8 text-primary shrink-0" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                PWA XML <span className="text-primary">Generator</span>
              </h1>
              <p className="text-xs text-gray-400">
                Rahaza Digital Premium Tools
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-primary" />
              <span>{showGuide ? 'Tutup Panduan' : 'Panduan Blogger'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Guide Banner (Collapsible) */}
      {showGuide && (
        <div className="bg-darker/90 border-b border-gray-800 px-4 sm:px-6 py-4 animate-fadeIn">
          <div className="max-w-7xl mx-auto glass-panel p-4 sm:p-5 rounded-xl border border-gray-700/60">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm text-gray-300">
                <h3 className="font-semibold text-white text-base">
                  Cara Memasang Tema XML di Blogger:
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-gray-300 pl-1">
                  <li>
                    Pastikan URL Web App Google Apps Script sudah berakhiran{' '}
                    <code className="bg-dark px-1.5 py-0.5 rounded text-primary">
                      /exec
                    </code>{' '}
                    dan aksesnya diatur ke{' '}
                    <span className="text-white font-medium">Anyone</span>.
                  </li>
                  <li>
                    Atur nama, tema warna, dan ikon aplikasi di formulir sebelah
                    kiri.
                  </li>
                  <li>
                    Klik tombol{' '}
                    <span className="text-primary font-semibold">Salin</span>{' '}
                    atau{' '}
                    <span className="text-primary font-semibold">Download</span>{' '}
                    file XML di panel kanan.
                  </li>
                  <li>
                    Buka dashboard <strong>Blogger</strong> &gt; menu{' '}
                    <strong>Tema (Theme)</strong> &gt; klik tanda panah ke bawah
                    di sebelah &quot;Sesuaikan&quot; (Customize) &gt; pilih{' '}
                    <strong>Edit HTML</strong>.
                  </li>
                  <li>
                    Hapus semua kode lama di Blogger, paste kode XML baru ini, lalu
                    klik tombol <strong>Simpan (Save)</strong>.
                  </li>
                  <li>
                    Buka URL blog Anda di smartphone — sekarang web app GAS
                    tampil fullscreen dan muncul banner{' '}
                    <strong>&quot;Tambahkan ke Layar Utama&quot;</strong> (Install
                    PWA)!
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 flex-1 w-full">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-4 sm:p-6 rounded-2xl shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              <span>Konfigurasi Aplikasi</span>
            </h2>

            <form
              id="configForm"
              onSubmit={(e) => e.preventDefault()}
              className="space-y-4"
            >
              {/* URL GAS */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  URL Google Apps Script (exec)
                </label>
                <input
                  type="url"
                  id="appUrl"
                  value={appUrl}
                  onChange={(e) => setAppUrl(e.target.value)}
                  className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  required
                />
              </div>

              {/* Nama Aplikasi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Nama Aplikasi
                  </label>
                  <input
                    type="text"
                    id="appName"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                    placeholder="Toko Online"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Nama Pendek
                  </label>
                  <input
                    type="text"
                    id="shortName"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                    placeholder="Toko"
                    required
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Deskripsi Singkat
                </label>
                <input
                  type="text"
                  id="appDesc"
                  value={appDesc}
                  onChange={(e) => setAppDesc(e.target.value)}
                  className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                  placeholder="Katalog produk dan keranjang belanja"
                />
              </div>

              {/* Tampilan: Warna & Ikon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Theme Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="themeColor"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="h-10 w-10 rounded cursor-pointer bg-transparent border-0"
                    />
                    <span
                      className="text-sm font-mono text-gray-400"
                      id="themeColorHex"
                    >
                      {themeColor.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Bg Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="bgColor"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-10 w-10 rounded cursor-pointer bg-transparent border-0"
                    />
                    <span
                      className="text-sm font-mono text-gray-400"
                      id="bgColorHex"
                    >
                      {bgColor.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tipe Ikon */}
              <div className="p-4 bg-darker border border-gray-800 rounded-xl space-y-3">
                <label className="block text-sm font-medium text-gray-400">
                  Sumber Ikon PWA
                </label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="iconType"
                      value="url"
                      checked={iconType === 'url'}
                      onChange={() => setIconType('url')}
                      className="mt-1 text-primary focus:ring-primary w-4 h-4 shrink-0"
                    />
                    <span className="text-sm text-gray-300 min-w-0">
                      URL Gambar{' '}
                      <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded inline-block">
                        (File XML Paling Ringan - Bebas Lag)
                      </span>
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="iconType"
                      value="text"
                      checked={iconType === 'text'}
                      onChange={() => setIconType('text')}
                      className="text-primary focus:ring-primary w-4 h-4"
                    />
                    <span className="text-sm text-gray-300">
                      Inisial Teks (SVG)
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="iconType"
                      value="image"
                      checked={iconType === 'image'}
                      onChange={() => setIconType('image')}
                      className="mt-1 text-primary focus:ring-primary w-4 h-4 shrink-0"
                    />
                    <span className="text-sm text-gray-300 min-w-0">
                      Upload Logo Lokal{' '}
                      <span className="text-xs text-yellow-400 inline-block">
                        (Auto-compress WebP)
                      </span>
                    </span>
                  </label>
                </div>

                {/* Input URL Eksternal */}
                {iconType === 'url' && (
                  <div
                    id="urlIconWrapper"
                    className="pt-2 border-t border-gray-800 mt-2"
                  >
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Link URL Gambar (PNG/JPG/WEBP)
                    </label>
                    <input
                      type="url"
                      id="iconUrl"
                      value={iconUrl}
                      onChange={(e) => setIconUrl(e.target.value)}
                      className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                      placeholder="https://blogger.googleusercontent.com/img/.../logo.png"
                    />
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      * <strong className="text-gray-400">Rekomendasi:</strong>{' '}
                      Upload logo Anda ke postingan Blogger, salin link gambarnya,
                      dan paste di sini. Ini mencegah file XML menjadi lag/terlalu
                      besar.
                    </p>
                  </div>
                )}

                {/* Input Teks */}
                {iconType === 'text' && (
                  <div
                    id="textIconWrapper"
                    className="pt-2 border-t border-gray-800 mt-2"
                  >
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Inisial Teks
                    </label>
                    <input
                      type="text"
                      id="iconText"
                      maxLength={2}
                      value={iconText}
                      onChange={(e) => setIconText(e.target.value)}
                      className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2 text-white font-bold text-center focus:outline-none focus:border-primary transition-colors text-sm"
                      placeholder="TK"
                    />
                  </div>
                )}

                {/* Input Gambar Base64 */}
                {iconType === 'image' && (
                  <div
                    id="imageIconWrapper"
                    className="pt-2 border-t border-gray-800 mt-2"
                  >
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Upload Logo
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="iconImage"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleImageUpload}
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-80 transition-colors bg-dark border border-gray-700 rounded-lg cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      * Gambar akan di-resize & dikompresi ke{' '}
                      <strong className="text-gray-400">
                        WebP (agar XML tidak berat)
                      </strong>{' '}
                      untuk ukuran 192x192 & 512x512.
                    </p>
                  </div>
                )}
              </div>
            </form>

            {/* Icon Preview Box */}
            <div className="mt-6 p-4 bg-dark rounded-xl border border-gray-800 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  <p className="font-medium text-white">Preview Ikon:</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {iconType === 'url'
                      ? iconUrl.trim()
                        ? 'Sumber: URL Eksternal'
                        : 'Default Fallback'
                      : iconType === 'text'
                      ? 'SVG Vektor Inisial'
                      : customIcon192Src
                      ? 'Kompresi WebP Lokal'
                      : 'Menunggu Upload'}
                  </p>
                </div>
                <div
                  className="w-16 h-16 rounded-xl shadow-lg overflow-hidden flex items-center justify-center border border-white/10"
                  id="iconPreviewContainer"
                  style={{ backgroundColor: bgColor }}
                >
                  {iconType === 'text' ? (
                    <span
                      id="iconPreviewText"
                      className="font-bold text-3xl font-sans"
                      style={{ color: themeColor }}
                    >
                      {iconText || 'T'}
                    </span>
                  ) : (
                    <img
                      id="iconPreviewImg"
                      src={activeIcon192}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Tools Ekstrak/Download Ikon PWA (Hanya aktif jika upload lokal) */}
              {iconType === 'image' && customIcon192Src && (
                <div
                  id="downloadToolsWrapper"
                  className="pt-4 border-t border-gray-800"
                >
                  <p className="text-xs text-gray-400 mb-2">
                    Download Aset Ikon PWA (Hasil Resize & Kompres WebP):
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      id="btnDl192"
                      onClick={() => handleDownloadIcon(192)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-darker hover:bg-gray-700 border border-gray-700 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> 192x192
                    </button>
                    <button
                      type="button"
                      id="btnDl512"
                      onClick={() => handleDownloadIcon(512)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-darker hover:bg-gray-700 border border-gray-700 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> 512x512
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Output Code */}
        <div className="lg:col-span-7 flex flex-col h-full space-y-4">
          <div className="glass-panel p-4 sm:p-6 rounded-2xl shadow-xl flex-grow flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2 flex-wrap">
                <FileCode className="w-5 h-5 text-primary" />
                <span>Hasil XML</span>
                <span id="xmlSizeInfo" className="text-xs font-normal ml-2">
                  (
                  <span
                    className={
                      isLarge
                        ? 'text-red-400 font-semibold'
                        : isMedium
                        ? 'text-yellow-400 font-semibold'
                        : 'text-green-400 font-semibold'
                    }
                  >
                    {xmlSizeKb} KB
                  </span>
                  )
                  {isLarge && (
                    <span className="text-red-400">
                      {' '}
                      (⚠️ Ukuran cukup besar, berpotensi lag di HP. Gunakan opsi
                      URL Gambar)
                    </span>
                  )}
                </span>
              </h2>
              <div className="flex gap-2">
                <button
                  id="btnCopy"
                  onClick={handleCopy}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-accent hover:bg-opacity-80 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4" /> Salin
                </button>
                <button
                  id="btnDownload"
                  onClick={handleDownloadXml}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-opacity-80 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </div>

            <div className="relative flex-grow min-h-[380px] lg:min-h-[500px]">
              <textarea
                id="xmlOutput"
                value={xmlOutput}
                readOnly
                className="absolute inset-0 w-full h-full bg-dark border border-gray-800 rounded-xl p-4 text-xs sm:text-sm font-mono text-green-400 focus:outline-none resize-none selection:bg-primary selection:text-white"
              />
            </div>

            {/* Quick feature pill highlights */}
            <div className="mt-4 pt-3 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Smartphone className="w-3.5 h-3.5 text-primary" /> Fullscreen
                  iFrame Standalone
                </span>
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Embedded
                  Base64 Manifest
                </span>
                <span className="flex items-center gap-1.5 text-gray-300">
                  <ExternalLink className="w-3.5 h-3.5 text-blue-400" /> Siap
                  Pasang di Blogger
                </span>
              </div>
              <span className="text-gray-500 font-mono">
                Blogger v3 + Widget v2
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 py-4 px-4 text-center text-xs text-gray-500">
        <p>
          PWA XML Generator &bull; Dibuat khusus untuk pengembang Google Apps
          Script &bull; Rahaza Digital
        </p>
      </footer>

      {/* Toast Notification */}
      <div
        id="toast"
        className={`fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm transform transition-all duration-300 glass-panel px-4 sm:px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50 pointer-events-none ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
        <span className="text-white font-medium text-sm" id="toastMessage">
          {toastMessage}
        </span>
      </div>
    </div>
  );
}
