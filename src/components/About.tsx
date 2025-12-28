import { HiBriefcase, HiDesktopComputer, HiGlobeAlt } from 'react-icons/hi'
import { FaRobot, FaBrain, FaBullseye, FaCog, FaTrophy } from 'react-icons/fa'

const About = () => {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <span className="gradient-text inline-flex items-center gap-2">
            <FaBrain className="inline" />
            About Me
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card animate-slide-up">
            <h3 className="text-2xl font-semibold mb-4 text-red-400">
              Background
            </h3>
            <p className="text-gray-100 leading-relaxed text-justify">
              Detail-oriented and motivated student with a strong foundation in{' '}
              <span className="text-orange-400 font-semibold">digital circuit design</span>,{' '}
              <span className="text-orange-400 font-semibold">logic simulation</span>, and{' '}
              <span className="text-orange-400 font-semibold">hardware programming</span>.
            </p>
          </div>

          <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-2xl font-semibold mb-4 text-red-500">
              Expertise
            </h3>
            <p className="text-gray-100 leading-relaxed text-justify">
              I have hands-on experience in embedded systems, web designing, and SQL database management systems. 
              I love building things from hardware circuits to AI-enhanced web interfaces!
            </p>
          </div>

          <div className="card animate-slide-up md:col-span-2" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-semibold mb-4 text-orange-500 flex items-center gap-2">
              <FaBullseye className="inline" />
              Experience & Projects
            </h3>
            <ul className="space-y-3 text-gray-100">
              <li className="flex items-start">
                <HiBriefcase className="text-2xl mr-3 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <strong>IC Design Intern - Xinyx Design Consultancy and Services Inc</strong> - Gained hands-on experience in integrated circuit design and verification
                </div>
              </li>
              <li className="flex items-start">
                <FaCog className="text-2xl mr-3 text-orange-400 flex-shrink-0 mt-1" />
                <div>
                  <strong>AMBA APB3 Project</strong> - Designed and verified AMBA APB3 protocol implementation using SystemVerilog
                </div>
              </li>
              <li className="flex items-start">
                <FaTrophy className="text-2xl mr-3 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <strong>CPE Challenge 2024</strong> - Participant in Java Programming competition by ICpEP.se
                </div>
              </li>
              <li className="flex items-start">
                <HiDesktopComputer className="text-2xl mr-3 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <strong>School Clinic Web Booking System</strong> - Developed with database, UI, and backend integration
                </div>
              </li>
              <li className="flex items-start">
                <HiGlobeAlt className="text-2xl mr-3 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <strong>Xepto Education Website</strong> - Managed during work immersion at Muntinlupa Science High School
                </div>
              </li>
              <li className="flex items-start">
                <FaRobot className="text-2xl mr-3 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <strong>DRRR Project</strong> - Built and programmed an automotive robot
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

