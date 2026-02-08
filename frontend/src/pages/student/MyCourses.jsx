import styled from "styled-components";

const CoursesContainer = styled.div`
  h2 {
    margin-bottom: 20px;
    color: #2c3e50;
  }
`;

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const CourseCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    color: #2c3e50;
    margin-bottom: 10px;
  }

  .progress {
    margin-top: 15px;
  }

  .progress-label {
    font-size: 12px;
    color: #7f8c8d;
    margin-bottom: 5px;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: #ecf0f1;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background-color: #3498db;
  }
`;

const MyCourses = () => {
  const courses = [
    { id: 1, name: "Web Development", progress: 75 },
    { id: 2, name: "Data Science", progress: 45 },
    { id: 3, name: "Mobile App Development", progress: 90 },
  ];

  return (
    <CoursesContainer>
      <h2>My Courses</h2>
      <CourseGrid>
        {courses.map((course) => (
          <CourseCard key={course.id}>
            <h3>{course.name}</h3>
            <div className="progress">
              <div className="progress-label">Progress: {course.progress}%</div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          </CourseCard>
        ))}
      </CourseGrid>
    </CoursesContainer>
  );
};

export default MyCourses;
