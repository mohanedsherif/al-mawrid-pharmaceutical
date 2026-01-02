import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import AnimatedSection from '../../components/ui/AnimatedSection';

const AboutPage = () => {
  const values = [
    {
      title: 'Flow & Continuity',
      description: 'Ensuring uninterrupted supply chains and consistent availability of essential pharmaceutical products for healthcare facilities.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Purity & Quality',
      description: 'Maintaining the highest standards of pharmaceutical purity through rigorous quality control and GMP-certified manufacturing processes.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Scientific Depth',
      description: 'Backed by extensive research, clinical studies, and scientific expertise to deliver evidence-based pharmaceutical solutions.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
  ];

  const differentiators = [
    {
      title: 'GMP Certified Manufacturing',
      description: 'All our products are manufactured in facilities that meet or exceed Good Manufacturing Practice (GMP) standards, ensuring the highest quality and safety standards in pharmaceutical production.',
    },
    {
      title: 'Comprehensive Product Portfolio',
      description: 'We offer a wide range of pharmaceutical solutions including cardiovascular medications, antibiotics, pain relief, vitamins, diabetes care, and respiratory treatments, meeting diverse healthcare needs.',
    },
    {
      title: 'Regulatory Compliance',
      description: 'Full adherence to local and international health authority regulations, with complete documentation and traceability for every product we supply.',
    },
  ];

  return (
    <div className="space-y-16 py-8 md:py-12 bg-white dark:bg-[#0F1E2E] min-h-screen">
      {/* Hero Section */}
      <AnimatedSection direction="fade" delay={0}>
        <section className="container-main">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-flow text-white p-10 md:p-14 lg:p-18 shadow-2xl bg-[length:400%_400%] animate-flow-gradient">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-700/90 via-primary-600/80 to-secondary-600/90 z-0"></div>
            <div className="relative z-10 max-w-4xl">
              <p className="uppercase tracking-wider text-sm font-semibold text-cta-200 mb-4 animate-fade-in">
                AL-MAWRID PHARMACEUTICALS
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight animate-slide-up">
                About Us
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl animate-fade-in">
                The Eternal Flow From Research to Healing. We are committed to delivering excellence in pharmaceutical solutions for healthcare professionals worldwide.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cta-400/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-400/15 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
            <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-secondary-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-bounce-subtle"></div>
          </div>
        </section>
      </AnimatedSection>

      {/* Who We Are */}
      <AnimatedSection direction="up" delay={100}>
        <section className="container-main">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 bg-gradient-to-r from-primary-600 via-secondary-500 to-cta-500 dark:from-primary-400 dark:via-secondary-400 dark:to-cta-400 bg-clip-text text-transparent">
                Who We Are
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-cta-500 mx-auto rounded-full"></div>
            </div>
            <Card className="p-8 md:p-10">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-[#2C3E50] dark:text-[#E6EEF6] text-lg leading-relaxed mb-6">
                  AL-MAWRID PHARMACEUTICALS (المَوْرِد للأدوية) is a distinguished pharmaceutical supplier founded on the foundational principles of <span className="font-semibold text-primary-600 dark:text-primary-400">Flow</span>, <span className="font-semibold text-secondary-600 dark:text-secondary-400">Continuity</span>, <span className="font-semibold text-cta-600 dark:text-cta-400">Purity</span>, and <span className="font-semibold text-accent-600 dark:text-accent-400">Scientific Depth</span>. Our name, derived from Arabic, signifies "The Source" — embodying our role as an essential bridge connecting cutting-edge pharmaceutical research with clinical practice and patient care.
                </p>
                <p className="text-[#2C3E50] dark:text-[#E6EEF6] text-lg leading-relaxed mb-6">
                  Operating at the intersection of pharmaceutical science and healthcare delivery, we facilitate the seamless translation of research findings into tangible therapeutic solutions. Our commitment extends beyond mere distribution; we ensure that evidence-based pharmaceutical products, backed by rigorous clinical trials and regulatory approvals, reach healthcare professionals with the scientific documentation and support they require to make informed therapeutic decisions.
                </p>
                <p className="text-[#2C3E50] dark:text-[#E6EEF6] text-lg leading-relaxed">
                  Our comprehensive understanding of pharmaceutical manufacturing standards, pharmacovigilance requirements, and regulatory frameworks enables us to serve as a trusted partner to hospitals, clinics, pharmacies, and research institutions. Every product in our portfolio undergoes meticulous quality assurance processes, from active pharmaceutical ingredient (API) verification to final packaging and labeling, ensuring compliance with international standards including WHO Good Manufacturing Practices (GMP), ISO certifications, and local health authority regulations.
                </p>
              </div>
            </Card>
          </div>
        </section>
      </AnimatedSection>

      {/* Our Mission */}
      <AnimatedSection direction="up" delay={200}>
        <section className="container-main">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200/50 dark:border-primary-700/30 shadow-lg">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary-700 dark:text-primary-300">
                  Our Mission
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
              </div>
              <div className="space-y-6">
                <p className="text-[#2C3E50] dark:text-[#E6EEF6] text-lg leading-relaxed">
                  Our mission is to ensure the <span className="font-semibold text-primary-600 dark:text-primary-400">eternal flow</span> of pharmaceutical excellence from research laboratories to healthcare facilities worldwide. We are dedicated to maintaining an uninterrupted, transparent, and traceable supply chain of evidence-based pharmaceutical products that meet the diverse therapeutic needs of healthcare professionals across multiple medical specialties.
                </p>
                <p className="text-[#2C3E50] dark:text-[#E6EEF6] text-lg leading-relaxed">
                  We strive to be the most scientifically rigorous and operationally reliable partner for hospitals, clinics, pharmacies, and research institutions by providing pharmaceutical products that are: (1) backed by peer-reviewed clinical research and regulatory approvals, (2) manufactured in facilities certified to Good Manufacturing Practice (GMP) standards, (3) subjected to rigorous quality control testing including dissolution, stability, and microbiological assessments, and (4) delivered with comprehensive scientific documentation including product monographs, prescribing information, and pharmacovigilance data.
                </p>
                <p className="text-[#2C3E50] dark:text-[#E6EEF6] text-lg leading-relaxed">
                  Every product we supply represents our commitment to supporting evidence-based medicine and patient-centered care. We recognize that pharmaceutical quality directly impacts therapeutic outcomes, and therefore, we maintain the highest standards of product integrity, cold chain management for temperature-sensitive formulations, and documentation throughout the entire supply chain, from manufacturing facilities to the point of patient administration.
                </p>
              </div>
            </div>
          </Card>
        </section>
      </AnimatedSection>

      {/* Our Values */}
      <AnimatedSection direction="up" delay={100}>
        <section className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 bg-gradient-to-r from-primary-600 via-secondary-500 to-cta-500 dark:from-primary-400 dark:via-secondary-400 dark:to-cta-400 bg-clip-text text-transparent">
              Our Core Values
            </h2>
            <p className="text-[#2C3E50] dark:text-[#E6EEF6] text-lg mb-2">
              The foundational principles that guide everything we do
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-cta-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <AnimatedSection
                key={value.title}
                direction="up"
                delay={200 + index * 100}
              >
                <Card hover className="p-8 text-center h-full transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-cta-200 dark:hover:border-cta-800">
                  <div className="text-cta-500 dark:text-cta-400 mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <div className="p-4 rounded-2xl bg-cta-50 dark:bg-cta-900/30">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl mb-4 text-[#2C3E50] dark:text-[#E6EEF6]">
                    {value.title}
                  </h3>
                  <p className="text-[#2C3E50]/70 dark:text-[#E6EEF6]/70 leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* What Makes Us Different */}
      <AnimatedSection direction="up" delay={100}>
        <section className="container-main">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 bg-gradient-to-r from-primary-600 via-secondary-500 to-cta-500 dark:from-primary-400 dark:via-secondary-400 dark:to-cta-400 bg-clip-text text-transparent">
                What Makes Us Different
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-cta-500 mx-auto rounded-full"></div>
            </div>
            <div className="space-y-6">
              {differentiators.map((item, index) => (
                <AnimatedSection
                  key={index}
                  direction="up"
                  delay={200 + index * 100}
                >
                  <Card hover className="p-8 border-l-4 border-l-primary-500 dark:border-l-primary-400 transform hover:translate-x-2 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl mb-3 text-primary-600 dark:text-primary-400">
                          {item.title}
                        </h3>
                        <p className="text-[#2C3E50] dark:text-[#E6EEF6] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Quality & Safety Commitment */}
      <AnimatedSection direction="up" delay={100}>
        <section className="container-main">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-cta-50 to-accent-50 dark:from-cta-900/20 dark:to-accent-900/20 border-cta-200/50 dark:border-cta-700/30 shadow-lg">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-cta-700 dark:text-cta-300">
                  Quality & Safety Commitment
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-cta-500 to-accent-500 mx-auto rounded-full"></div>
              </div>
              <div className="space-y-6">
                <p className="text-[#2C3E50] dark:text-[#E6EEF6] text-lg leading-relaxed">
                  Quality is not just a standard for us—it's a <span className="font-semibold text-cta-600 dark:text-cta-400">fundamental commitment</span> rooted in scientific rigor and regulatory compliance. Every product in our portfolio undergoes comprehensive quality assurance processes aligned with ICH (International Council for Harmonisation) guidelines, from raw material sourcing and API (Active Pharmaceutical Ingredient) verification to final packaging and labeling. We work exclusively with manufacturers certified to WHO GMP standards, FDA-compliant facilities, and ISO 9001:2015 quality management systems.
                </p>
                <p className="text-[#2C3E50] dark:text-[#E6EEF6] text-lg leading-relaxed">
                  Our quality management system (QMS) ensures complete end-to-end traceability, comprehensive batch documentation following ISO 13485 principles, and full compliance with relevant health authority regulations including FDA, EMA, WHO, and regional regulatory bodies. We maintain validated cold chain protocols (2-8°C for refrigerated products, -20°C for frozen formulations) for temperature-sensitive pharmaceutical products and implement comprehensive quality control measures including HPLC (High-Performance Liquid Chromatography) analysis, dissolution testing, microbial limit testing, and container-closure integrity verification at every critical stage of the supply chain.
                </p>
                <p className="text-[#2C3E50] dark:text-[#E6EEF6] text-lg leading-relaxed">
                  <span className="font-semibold text-cta-600 dark:text-cta-400">Patient safety and therapeutic efficacy are our highest priorities</span>. We continuously invest in quality assurance infrastructure, pharmacovigilance systems, staff training in Good Distribution Practice (GDP), and process improvements aligned with ICH Q10 Pharmaceutical Quality System principles. Every product we deliver is accompanied by Certificate of Analysis (CoA), stability data, and regulatory documentation to ensure that healthcare professionals have the scientific evidence necessary to make informed prescribing decisions, ultimately supporting optimal patient outcomes.
                </p>
              </div>
            </div>
          </Card>
        </section>
      </AnimatedSection>

      {/* Our Vision */}
      <AnimatedSection direction="up" delay={100}>
        <section className="container-main">
          <div className="max-w-4xl mx-auto">
            <Card className="p-10 md:p-12 text-center bg-gradient-to-br from-cta-50/50 to-accent-50/50 dark:from-cta-900/10 dark:to-accent-900/10 border-cta-200/50 dark:border-cta-700/30">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 bg-gradient-to-r from-primary-600 via-secondary-500 to-cta-500 dark:from-primary-400 dark:via-secondary-400 dark:to-cta-400 bg-clip-text text-transparent">
              Our Vision
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-cta-500 mx-auto rounded-full mb-8"></div>
            <p className="text-[#2C3E50] dark:text-[#E6EEF6] text-lg leading-relaxed mb-10 max-w-3xl mx-auto">
              We envision a future where every healthcare professional, regardless of geographic location or institutional size, has reliable, equitable access to the highest quality, evidence-based pharmaceutical products. Our vision encompasses a seamless and uninterrupted flow from pharmaceutical research laboratories through manufacturing facilities, quality control laboratories, and distribution networks to healthcare facilities and ultimately to patients. We aspire to be recognized as the most scientifically rigorous, operationally reliable, and ethically committed pharmaceutical partner, distinguished by our unwavering dedication to supporting the global healthcare community through innovation in pharmaceutical supply chain management, pharmacovigilance excellence, and commitment to advancing public health outcomes through evidence-based pharmaceutical distribution.
            </p>
            <Link to="/products">
              <Button variant="primary" size="lg" className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                Explore Our Products
              </Button>
            </Link>
          </Card>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};

export default AboutPage;

