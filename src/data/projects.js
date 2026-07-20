import netflixCloneCover from '../assets/images/projects/netflix-clone-cover.png'
import penguinEcommerceCover from '../assets/images/projects/penguin-ecommerce-cover.png'

const projects = [
  {
    number: '01',
    name: 'Penguin E-Commerce',
    description: 'Modern, responsive ve kullanıcı dostu bir e-ticaret deneyimi. Ürün keşfinden güvenli kullanıcı akışlarına kadar uçtan uca geliştirildi.',
    technologies: ['React', 'Redux Toolkit', 'Firebase', 'Tailwind CSS', 'Framer Motion', 'Axios', 'REST API'],
    features: ['Ürün listeleme', 'Filtreleme ve arama', 'Sepet yönetimi', 'Kullanıcı girişi', 'Korumalı sepet', 'Responsive tasarım'],
    demo: 'https://penguin-ecommerce-store.netlify.app/',
    github: 'https://github.com/alevyldrm/Penguin-Store',
    theme: 'commerce',
    cover: penguinEcommerceCover,
  },
  {
    number: '02',
    name: 'Netflix Clone',
    description: 'Netflix arayüzünden esinlenen; component tabanlı yapı, routing ve farklı ekran boyutlarına uyum üzerine kurulu bir web uygulaması.',
    technologies: ['React', 'JavaScript', 'CSS', 'React Router'],
    features: ['Component tabanlı yapı', 'Responsive arayüz', 'Routing ve navigasyon', 'Yeniden kullanılabilir bileşenler'],
    demo: 'https://cloneproject-demo.netlify.app/',
    github: 'https://github.com/alevyldrm/netflix-project',
    theme: 'streaming',
    cover: netflixCloneCover,
  },
]

export default projects
