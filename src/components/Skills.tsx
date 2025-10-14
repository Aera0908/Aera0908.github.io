const Skills = () => {
  const skillCategories = [
    {
      title: '💻 Programming Languages',
      color: 'blue',
      skills: [
        { name: 'C++', color: '00599C' },
        { name: 'Java', color: 'ED8B00' },
        { name: 'JavaScript', color: 'F7DF1E' },
        { name: 'PHP', color: '777BB4' },
        { name: 'HTML5', color: 'E34F26' },
        { name: 'Verilog', color: '2C3E50' },
        { name: 'SystemVerilog', color: '34495E' },
      ],
    },
    {
      title: '🚀 Frameworks & Libraries',
      color: 'purple',
      skills: [
        { name: 'React', color: '61DAFB' },
        { name: 'TailwindCSS', color: '38B2AC' },
        { name: 'Bootstrap', color: '8511FA' },
        { name: 'Django', color: '092E20' },
        { name: 'Node.js', color: '6DA55F' },
      ],
    },
    {
      title: '☁️ Cloud & DevOps',
      color: 'pink',
      skills: [
        { name: 'Firebase', color: 'FFCA28' },
        { name: 'Google Cloud', color: '4285F4' },
        { name: 'GitHub', color: '121011' },
        { name: 'NPM', color: 'CB3837' },
      ],
    },
    {
      title: '🗄️ Databases',
      color: 'green',
      skills: [
        { name: 'MySQL', color: '4479A1' },
        { name: 'MariaDB', color: '003545' },
        { name: 'Firebase', color: 'a08021' },
      ],
    },
    {
      title: '🎨 Design Tools',
      color: 'red',
      skills: [
        { name: 'Figma', color: 'F24E1E' },
        { name: 'Adobe Photoshop', color: '31A8FF' },
        { name: 'Adobe Illustrator', color: 'FF9A00' },
        { name: 'Canva', color: '00C4CC' },
        { name: 'Blender', color: 'F5792A' },
      ],
    },
    {
      title: '🔧 Hardware & IoT',
      color: 'yellow',
      skills: [
        { name: 'Arduino', color: '00979D' },
        { name: 'Raspberry Pi', color: 'C51A4A' },
      ],
    },
  ]

  const allTechBadges = [
    'https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white',
    'https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white',
    'https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white',
    'https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E',
    'https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white',
    'https://img.shields.io/badge/PowerShell-%235391FE.svg?style=for-the-badge&logo=powershell&logoColor=white',
    'https://img.shields.io/badge/Firebase-%23039BE5.svg?style=for-the-badge&logo=firebase',
    'https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white',
    'https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white',
    'https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white',
    'https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white',
    'https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white',
    'https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB',
    'https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white',
    'https://img.shields.io/badge/MySQL-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white',
    'https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white',
    'https://img.shields.io/badge/Adobe%20Photoshop-%2331A8FF.svg?style=for-the-badge&logo=adobe%20photoshop&logoColor=white',
    'https://img.shields.io/badge/Adobe%20Illustrator-%23FF9A00.svg?style=for-the-badge&logo=adobe%20illustrator&logoColor=white',
    'https://img.shields.io/badge/Figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white',
    'https://img.shields.io/badge/Canva-%2300C4CC.svg?style=for-the-badge&logo=Canva&logoColor=white',
    'https://img.shields.io/badge/Blender-%23F5792A.svg?style=for-the-badge&logo=blender&logoColor=white',
    'https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white',
    'https://img.shields.io/badge/-Arduino-00979D?style=for-the-badge&logo=Arduino&logoColor=white',
    'https://img.shields.io/badge/-Raspberry_Pi-C51A4A?style=for-the-badge&logo=Raspberry-Pi',
  ]

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <span className="gradient-text">💻 Tech Stack</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="card group animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <h3 className="text-xl font-semibold mb-4 group-hover:scale-105 transition-transform">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, sIndex) => (
                  <span
                    key={sIndex}
                    className={`px-3 py-1 rounded-full text-sm bg-gradient-to-r from-${category.color}-500/20 to-${category.color}-600/20 border border-${category.color}-500/30 hover:border-${category.color}-400 transition-all hover:scale-110 cursor-default`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tech Badges Section */}
        <div className="card">
          <h3 className="text-2xl font-semibold mb-6 text-center">
            🏆 Technology Badges
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {allTechBadges.map((badge, index) => (
              <img
                key={index}
                src={badge}
                alt="Tech badge"
                className="tech-badge"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills

