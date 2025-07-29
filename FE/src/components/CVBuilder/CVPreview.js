import React from 'react';

const CVPreview = ({ data }) => {
  const { personalInfo, objective, experience, education, skills, awards } = data;

  return (
    <div className="p-10 text-sm leading-relaxed font-sans text-black bg-white w-full h-full">
      {/* Header */}
      <header className="mb-4 flex items-start gap-4">
        {personalInfo.photo && (
          <img src={personalInfo.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border" />
        )}
        <div>
          <h1 className="text-2xl font-bold uppercase">{personalInfo.fullName}</h1>
          {personalInfo.jobTitle && <p className="text-gray-700">{personalInfo.jobTitle}</p>}
          <p className="text-gray-600 text-sm">
            {personalInfo.email} | {personalInfo.phone}
            {personalInfo.website && <> | {personalInfo.website}</>}
          </p>
        </div>
      </header>

      <hr className="my-3 border-gray-300" />

      {/* Mục tiêu nghề nghiệp */}
      {objective && (
        <section className="mb-4">
          <h2 className="font-bold text-lg mb-1">Mục tiêu nghề nghiệp</h2>
          <p>{objective}</p>
        </section>
      )}

      {/* Kinh nghiệm */}
      {experience?.length > 0 && (
        <section className="mb-4">
          <h2 className="font-bold text-lg mb-1">Kinh nghiệm làm việc</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-2">
              <p className="font-semibold">{exp.position}</p>
              <p className="text-sm text-gray-700">
                tại {exp.company} ({exp.duration})
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                {exp.description.split('\n').filter(line => line.trim() !== '').map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Học vấn */}
      {education?.length > 0 && (
        <section className="mb-4">
          <h2 className="font-bold text-lg mb-1">Học vấn</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-1">
              <p className="font-semibold">{edu.school}</p>
              <p className="text-sm text-gray-700">{edu.degree} ({edu.duration})</p>
            </div>
          ))}
        </section>
      )}

      {/* Kỹ năng */}
      {skills && (
        <section className="mb-4">
          <h2 className="font-bold text-lg mb-1">Kỹ năng</h2>
          <p>{skills}</p>
        </section>
      )}

      {/* Giải thưởng */}
      {awards?.length > 0 && (
        <section className="mb-2">
          <h2 className="font-bold text-lg mb-1">Giải thưởng</h2>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {awards.map((award) => (
              <li key={award.id}>{award.title} ({award.year})</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default CVPreview;
