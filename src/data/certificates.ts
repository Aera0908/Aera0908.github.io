export interface Certificate {
  name: string
  issuer: string
  description: string
  url: string
  downloadName?: string
  category: 'AI & Web3' | 'Software & Frontend' | 'Hardware & Systems'
  featured?: boolean
}

export const certificatesData: Certificate[] = [
  {
    name: 'AI Fluency: Framework & Foundations',
    issuer: 'Anthropic',
    description: 'Framing and evaluating foundations for building AI agents and workflows.',
    url: '/CERTIFICATE-PREVIEWS/AI%20-%20Fluency%20Framework%20%26%20Foundations%20by%20Anthropic.pdf',
    downloadName: 'YNTE-Anthropic-AI-Fluency.pdf',
    category: 'AI & Web3',
    featured: true,
  },
  {
    name: 'The AI Engineer Path Certificate',
    issuer: 'Scrimba',
    description: 'AI integration, model engineering, and agent systems development.',
    url: '/CERTIFICATE-PREVIEWS/The%20AI%20Engineer%20Path.pdf',
    downloadName: 'YNTE-Scrimba-AI-Engineer-Path.pdf',
    category: 'AI & Web3',
    featured: true,
  },
  {
    name: 'On-the-Job Training Certificate',
    issuer: 'Xinyx Design Engineering, Inc.',
    description: 'Completion of OJT engagement — digital logic design and peripheral verification.',
    url: '/CERTIFICATE-PREVIEWS/YNTE-XINYX-OJT-CERTIFICATE.pdf',
    downloadName: 'YNTE-XINYX-OJT-CERTIFICATE.pdf',
    category: 'Hardware & Systems',
    featured: true,
  },
  {
    name: 'Blockchain4Youth Certificate',
    issuer: 'Bitget Blockchain4Youth',
    description: 'Certification in blockchain technology, smart contract development, and Web3 fundamentals.',
    url: '/CERTIFICATE-PREVIEWS/B4Y-Certificate-Aira-Josh-C.-Ynte.jpg',
    downloadName: 'B4Y-Certificate-Aira-Josh-C.-Ynte.jpg',
    category: 'AI & Web3',
  },
  {
    name: 'Learn React Certificate',
    issuer: 'Scrimba',
    description: 'Comprehensive React.js course completion and frontend routing.',
    url: '/CERTIFICATE-PREVIEWS/Learn%20React%20Certificate.pdf',
    downloadName: 'YNTE-Scrimba-Learn-React.pdf',
    category: 'Software & Frontend',
  },
  {
    name: 'Learn TailwindCSS Certificate',
    issuer: 'Scrimba',
    description: 'Modern utility-first CSS framework mastery and responsive layout design.',
    url: '/CERTIFICATE-PREVIEWS/Learn%20Tailwind%20CSS.pdf',
    downloadName: 'YNTE-Scrimba-Learn-Tailwind-CSS.pdf',
    category: 'Software & Frontend',
  },
  {
    name: 'Zuitt Game Dev Certificate',
    issuer: 'Zuitt',
    description: 'Basic Web Development Workshop.',
    url: '/CERTIFICATE-PREVIEWS/Aira%20Josh%20C.%20Ynte%20Basic%20Web%20Development%20Workshop%20(June%2015)%20-%20Certificate%20of%20Participation%20(1).pdf',
    downloadName: 'YNTE-Zuitt-Basic-Web-Dev-Workshop.pdf',
    category: 'Software & Frontend',
  },
  {
    name: 'TINA DESIGN SUITE WORKSHOP',
    issuer: 'Hytec Power & Inc.',
    description: 'Workshop on the TINA circuit simulation and PCB design suite.',
    url: '/CERTIFICATE-PREVIEWS/YNTE-DESIGNSOFT-TINA.pdf',
    downloadName: 'YNTE-DESIGNSOFT-TINA.pdf',
    category: 'Hardware & Systems',
  },
  {
    name: 'Understanding EDR: Protecting Endpoints Against Modern Threats',
    issuer: 'Cybersecurity Training',
    description: 'Endpoint Detection & Response (EDR) fundamentals and threat intelligence.',
    url: '/CERTIFICATE-PREVIEWS/YNTE%20-%20Understanding%20EDR%20Protecting%20Endpoints%20Against%20Modern%20Threats.pdf',
    downloadName: 'YNTE-Understanding-EDR.pdf',
    category: 'Hardware & Systems',
  },
]
