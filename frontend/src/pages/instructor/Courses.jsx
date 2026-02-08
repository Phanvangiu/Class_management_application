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

  p {
    color: #7f8c8d;
    font-size: 14px;
  }
`;

const Courses = () => {
  const courses = [
    { id: 1, name: "Web Development", students: 45 },
    { id: 2, name: "Data Science", students: 32 },
    { id: 3, name: "Mobile App Development", students: 28 },
  ];

  return (
    <CoursesContainer>
      <h2>My Courses</h2>
      <CourseGrid>
        {courses.map((course) => (
          <CourseCard key={course.id}>
            <h3>{course.name}</h3>
            <p>{course.students} students enrolled</p>
          </CourseCard>
        ))}
      </CourseGrid>
    </CoursesContainer>
  );
};

export default Courses;
