import { Container } from "../../components/container";
import Link from "next/link";
import styled from "styled-components";
import { getToken } from "next-auth/jwt";

const StudentDetails = ({ student, error }) => {
  if (error) {
    return <Container>{error}</Container>;
  }
  return (
    <Container>
      <Link href="/" passHref>
        <StyledBackLink>Zurück zur Übersicht</StyledBackLink>
      </Link>
      <h1>{`${student.firstName} ${student.lastName}`}</h1>
      <a
        href={`https://github.com/${student.githubUserName}`}
        target="_blank"
        rel="noreferrer"
      >
        {student.githubUserName} on Github
      </a>
      <p>
        <strong>Capstone Project: {student.capstoneProject} </strong>
      </p>
      <p>{`${student.capstoneProjectDescription}`}</p>
    </Container>
  );
};

export async function getServerSideProps({ req, res, params }) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      raw: true,
    });
    const { id } = params;
    const response = await fetch(
      `http://${req.headers.host}/api/students/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const student = await response.json();
      return { props: { student } };
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    return { props: { error: error.message } };
  }
}

const StyledBackLink = styled.a`
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 0.6em;
`;

export default StudentDetails;
