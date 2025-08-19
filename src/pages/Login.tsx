import { useState, useEffect, useContext } from "react";
import { Eye, EyeOff, KeyRound, Mail, ChevronLeft, ChevronRight,  Brain,  Code } from "lucide-react";
import { AuthContext } from "@/contexts/Auth";
import logo from '../../public/logo.jpeg'
const carouselSlides = [
  {
    id: 1,
    title: "Integrações e Soluções",
    subtitle: "Transformamos ideias em soluções tecnológicas revolucionárias",
    icon: Code,
    gradient: "from-purple-600 to-blue-600",
    description: "Desenvolvemos aplicações que impulsionam o futuro dos negócios"
  },
  {
    id: 2,
    title: "Facilidade na integração com ERP",
    subtitle: "Sysprov integrações",
    icon: Brain,
    gradient: "from-emerald-600 to-teal-600",
    description: "Integrando erp + olé tv"
  },


];

export default function SmartSaveLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

 const { signin } = useContext(AuthContext);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!email || !password) return alert("Preencha todos os campos!");

    setIsLoading(true);
    const result = await signin({ email, password });
    console.log(result);
    setIsLoading(false);
    setPassword("");
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const currentSlideData = carouselSlides[currentSlide];
  const IconComponent = currentSlideData.icon;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Login Form Section - Left */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        <div className="absolute top-8 left-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <img src={logo} alt="" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SysProv + Frionline
            </span>
          </div>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Bem-vindo de volta</h1>
            <p className="text-gray-600">Entre na sua conta para continuar</p>
          </div>

          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 h-12 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Digite seu email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <KeyRound size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 h-12 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              onClick={handleSubmit}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Entrando...
                </div>
              ) : (
                "Entrar na plataforma"
              )}
            </button>
          </div>

          {/* <div className="text-center text-sm text-gray-500">
            <p>Ao continuar, você concorda com nossos</p>
            <div className="flex gap-1 justify-center">
              <button className="text-blue-600 hover:underline">Termos de Uso</button>
              <span>e</span>
              <button className="text-blue-600 hover:underline">Política de Privacidade</button>
            </div>
          </div> */}
        </div>
      </div>

      {/* Carousel Section - Right */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          className={`h-full w-full bg-gradient-to-br ${currentSlideData.gradient} flex items-center justify-center transition-all duration-1000 ease-in-out`}
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 border border-white/30 rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-20 w-16 h-16 border border-white/20 rounded-lg rotate-45 animate-bounce"></div>
            <div className="absolute bottom-20 left-20 w-12 h-12 border border-white/25 rounded-full animate-ping"></div>
            <div className="absolute bottom-40 right-10 w-24 h-24 border border-white/15 rounded-lg animate-pulse"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center text-white p-12 max-w-lg">
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <IconComponent size={40} className="text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              {currentSlideData.title}
            </h2>
            
            <p className="text-xl mb-4 text-white/90">
              {currentSlideData.subtitle}
            </p>
            
            <p className="text-white/80 leading-relaxed">
              {currentSlideData.description}
            </p>
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200"
          >
            <ChevronRight size={24} className="text-white" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}