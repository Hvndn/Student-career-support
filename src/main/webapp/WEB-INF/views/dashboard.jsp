<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>

<html lang="vi"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Student Career Support System - Nâng Tầm Sự Nghiệp</title>
<!-- Tailwind CSS CDN with Plugins -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Google Fonts: Inter & Bricolage Grotesque -->
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&amp;family=Inter:wght@300;400;500;600&amp;display=swap" rel="stylesheet"/>
<script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '#2563eb',
            glass: 'rgba(255, 255, 255, 0.7)',
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            display: ['Bricolage Grotesque', 'sans-serif'],
          },
          animation: {
            'float': 'float 6s ease-in-out infinite',
            'float-delayed': 'float 8s ease-in-out infinite 2s',
            'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          },
          keyframes: {
            float: {
              '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
              '50%': { transform: 'translateY(-20px) rotate(2deg)' },
            }
          }
        }
      }
    }
  </script>
<style data-purpose="custom-glassmorphism">
    .glass-card {
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
    }
    
    .bg-mesh {
      background-color: #ffffff;
      background-image: 
        radial-gradient(at 0% 0%, hsla(221, 83%, 53%, 0.1) 0, transparent 50%), 
        radial-gradient(at 50% 0%, hsla(221, 83%, 53%, 0.05) 0, transparent 50%), 
        radial-gradient(at 100% 0%, hsla(221, 83%, 53%, 0.1) 0, transparent 50%);
    }

    .abstract-shape {
      position: absolute;
      z-index: -1;
      filter: blur(60px);
      border-radius: 50%;
    }
  </style>
</head>
<body class="bg-mesh font-sans text-slate-900 antialiased overflow-x-hidden">
<!-- BEGIN: Navigation -->
<nav class="fixed top-0 w-full z-50 px-6 py-4">
<div class="max-w-7xl mx-auto flex items-center justify-between glass-card px-6 py-3 rounded-full">
<div class="flex items-center gap-2">
<div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
<div class="w-4 h-4 bg-white rounded-sm rotate-45"></div>
</div>
<span class="font-display font-bold text-xl tracking-tight">SCSS</span>
</div>
<div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
<a class="hover:text-primary transition-colors" href="#">Tính năng</a>
<a class="hover:text-primary transition-colors" href="#">Đối tác</a>
<a class="hover:text-primary transition-colors" href="#">Về chúng tôi</a>
</div>
<div class="flex items-center gap-4">
<a href="/login" class="btn btn-link text-decoration-none text-sm font-medium px-4 py-2 hover:text-primary transition-colors">Đăng nhập</a>
<a href="/students/register" class="btn btn-primary text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95 text-decoration-none">
          Bắt đầu ngay
        </a>
</div>
</div>
</nav>
<!-- END: Navigation -->
<!-- BEGIN: HeroSection -->
<main class="relative pt-32 pb-20 px-6 overflow-hidden">
<!-- Abstract Background Elements -->
<div class="abstract-shape w-[500px] h-[500px] bg-blue-100 top-[-10%] left-[-10%] animate-pulse-slow"></div>
<div class="abstract-shape w-[400px] h-[400px] bg-blue-50 bottom-[10%] right-[-5%] animate-pulse-slow" style="animation-delay: 2s;"></div>
<div class="max-w-7xl mx-auto relative">
<div class="grid lg:grid-cols-2 gap-12 items-center">
<!-- Hero Content -->
<div class="text-center lg:text-left" data-purpose="hero-text-content">
<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
<span class="relative flex h-2 w-2">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
<span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
</span>
<span class="text-xs font-semibold text-blue-600 uppercase tracking-wider">Phiên bản 2.0 đã sẵn sàng</span>
</div>
<h1 class="font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8">
            Nâng Tầm <span class="text-primary italic">Sự Nghiệp</span> <br/> Sinh Viên
          </h1>
<p class="text-lg text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Hệ sinh thái định hướng sự nghiệp toàn diện sử dụng trí tuệ nhân tạo, giúp sinh viên kết nối trực tiếp với các tập đoàn hàng đầu và xây dựng lộ trình phát triển đột phá.
          </p>
<div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
<button class="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300">
              Khám phá lộ trình
            </button>
<button class="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all duration-300">
              Xem bản demo
            </button>
</div>
<div class="mt-12 flex items-center justify-center lg:justify-start gap-4 grayscale opacity-60">
<p class="text-xs font-bold text-slate-400 uppercase tracking-widest mr-4">Trusted By</p>
<div class="flex gap-6">
<span class="font-bold text-xl">VinFast</span>
<span class="font-bold text-xl">FPT</span>
<span class="font-bold text-xl">Viettel</span>
</div>
</div>
</div>
<!-- Hero Visual (Asymmetric Grid) -->
<div class="relative min-h-[500px]" data-purpose="hero-visual">
<!-- Main Floating Card -->
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-96 bg-gradient-to-br from-primary to-blue-400 rounded-[2rem] shadow-2xl rotate-3 animate-float overflow-hidden">
<div class="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
<div class="p-8 text-white">
<div class="w-12 h-12 bg-white/20 rounded-xl mb-4 backdrop-blur-sm"></div>
<div class="h-2 w-24 bg-white/30 rounded-full mb-2"></div>
<div class="h-2 w-32 bg-white/30 rounded-full mb-12"></div>
<div class="space-y-4">
<div class="h-10 w-full bg-white/20 rounded-lg"></div>
<div class="h-10 w-full bg-white/20 rounded-lg"></div>
</div>
</div>
</div>
<!-- Glass Floating Cards -->
<div class="absolute top-0 right-0 glass-card p-6 rounded-2xl w-56 animate-float-delayed z-10 shadow-xl">
<div class="flex items-center gap-3 mb-4">
<div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">AI</div>
<div>
<p class="text-xs font-bold">Job Matching</p>
<p class="text-[10px] text-slate-500">98% Match Rate</p>
</div>
</div>
<div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
<div class="w-[98%] h-full bg-green-500"></div>
</div>
</div>
<div class="absolute bottom-10 left-0 glass-card p-6 rounded-2xl w-64 animate-float z-10 shadow-xl">
<p class="text-xs font-bold text-slate-400 mb-2">NETWORK GROWTH</p>
<div class="flex items-end gap-1 h-12">
<div class="flex-1 bg-blue-100 h-1/2 rounded-t-sm"></div>
<div class="flex-1 bg-blue-200 h-2/3 rounded-t-sm"></div>
<div class="flex-1 bg-blue-300 h-3/4 rounded-t-sm"></div>
<div class="flex-1 bg-primary h-full rounded-t-sm"></div>
</div>
</div>
</div>
</div>
</div>
</main>
<!-- END: HeroSection -->
<!-- BEGIN: FeaturesSection -->
<section class="py-24 px-6 relative">
<div class="max-w-7xl mx-auto">
<div class="text-center mb-20">
<h2 class="font-display text-4xl md:text-5xl font-bold mb-6">Giải pháp toàn diện cho <br/> tương lai của bạn</h2>
<div class="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
</div>
<div class="grid md:grid-cols-3 gap-8">
<!-- Feature 1 -->
<div class="glass-card p-10 rounded-[2.5rem] hover:-translate-y-2 transition-all duration-500 group">
<div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
<svg class="w-8 h-8" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
</div>
<h3 class="font-display text-2xl font-bold mb-4">AI Job Matching</h3>
<p class="text-slate-600 leading-relaxed">Thuật toán phân tích kỹ năng và định hướng để gợi ý những công việc phù hợp nhất với hồ sơ cá nhân của bạn.</p>
</div>
<!-- Feature 2 -->
<div class="glass-card p-10 rounded-[2.5rem] mt-8 md:mt-16 hover:-translate-y-2 transition-all duration-500 group">
<div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
<svg class="w-8 h-8" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
</div>
<h3 class="font-display text-2xl font-bold mb-4">Portfolio Builder</h3>
<p class="text-slate-600 leading-relaxed">Xây dựng hồ sơ năng lực chuyên nghiệp chuẩn quốc tế chỉ trong vài phút với các mẫu thiết kế cao cấp.</p>
</div>
<!-- Feature 3 -->
<div class="glass-card p-10 rounded-[2.5rem] hover:-translate-y-2 transition-all duration-500 group">
<div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
<svg class="w-8 h-8" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
</div>
<h3 class="font-display text-2xl font-bold mb-4">Recruiter Network</h3>
<p class="text-slate-600 leading-relaxed">Tiếp cận trực tiếp với mạng lưới hơn 500+ nhà tuyển dụng từ các tập đoàn đa quốc gia và startup kỳ lân.</p>
</div>
</div>
</div>
</section>
<!-- END: FeaturesSection -->
<!-- BEGIN: CTASection -->
<section class="py-24 px-6">
<div class="max-w-5xl mx-auto glass-card rounded-[3rem] p-12 text-center relative overflow-hidden">
<!-- Background glow -->
<div class="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full"></div>
<div class="relative z-10">
<h2 class="font-display text-3xl md:text-5xl font-bold mb-8">Sẵn sàng bắt đầu hành trình sự nghiệp?</h2>
<p class="text-slate-600 text-lg mb-10 max-w-2xl mx-auto">Gia nhập cộng đồng hơn 50,000 sinh viên đã tìm thấy công việc mơ ước thông qua nền tảng của chúng tôi.</p>
<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
<button class="px-10 py-5 bg-primary text-white font-bold rounded-2xl shadow-2xl hover:scale-105 transition-transform">
            Đăng ký miễn phí ngay
          </button>
<button class="px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors">
            Dành cho nhà tuyển dụng
          </button>
</div>
</div>
</div>
</section>
<!-- END: CTASection -->
<!-- BEGIN: Footer -->
<footer class="py-12 px-6 border-t border-slate-100">
<div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
<div class="flex items-center gap-2">
<div class="w-6 h-6 bg-primary rounded flex items-center justify-center">
<div class="w-3 h-3 bg-white rounded-sm rotate-45"></div>
</div>
<span class="font-display font-bold text-lg">SCSS</span>
</div>
<div class="flex gap-8 text-sm text-slate-500 font-medium">
<a class="hover:text-primary" href="#">Chính sách bảo mật</a>
<a class="hover:text-primary" href="#">Điều khoản dịch vụ</a>
<a class="hover:text-primary" href="#">Liên hệ</a>
</div>
<p class="text-sm text-slate-400">© 2024 SCSS. Nâng tầm tương lai Việt.</p>
</div>
</footer>
<!-- END: Footer -->
</body></html>