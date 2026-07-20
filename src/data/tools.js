import {
  SiAxios,
  SiFigma,
  SiFirebase,
  SiGit,
  SiGithub,
  SiNetlify,
  SiVite,
} from 'react-icons/si'
import { VscCode } from 'react-icons/vsc'

const toolCategories = [
  { number: '01', title: 'Development', tools: [['VS Code', VscCode], ['Vite', SiVite], ['Axios', SiAxios]] },
  { number: '02', title: 'Version Control', tools: [['Git', SiGit], ['GitHub', SiGithub]] },
  { number: '03', title: 'Backend Services', tools: [['Firebase', SiFirebase]] },
  { number: '04', title: 'Deployment', tools: [['Netlify', SiNetlify]] },
  { number: '05', title: 'Design', tools: [['Figma', SiFigma]] },
]

export default toolCategories
