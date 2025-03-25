// src/lib/api.ts - Refactored API methods with graduationYear handling

export const API_URL = '/api/graphql';  // Use relative path
export const API_BASE_URL = '';  // Use empty string for same origin
//export const API_URL = 'http://localhost:3000/api/graphql';
//export const API_BASE_URL = 'http://localhost:3000';
import { Project } from "@/types/learning-path";

// Helper function to get the full URL for images or files
export const getFullUrl = (url?: string) => {
  if (!url) return undefined;
  
  // If the URL already starts with http:// or https://, return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, prepend the API base URL
  return `${API_BASE_URL}${url}`;
};

export async function fetchGraphQL(query: string, variables = {}) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      credentials: 'include',
    });

    const json = await response.json();

    if (json.errors) {
      console.error('GraphQL Errors:', json.errors);
      throw new Error(`GraphQL Error: ${json.errors[0].message}`);
    }

    return json.data;
  } catch (error) {
    console.error('Failed to fetch from GraphQL API:', error);
    throw error;
  }
}

// Updated getStudents function to handle year_ prefixed enum values
export async function getStudents() {
  const query = `
    query GetStudents {
      students {
        id
        name
        class {
          id
          name
        }
        graduationYear
      }
    }
  `;

  try {
    const data = await fetchGraphQL(query);
    // The API returns enum values like "year_2025", we'll keep these as is
    // and handle the formatting at display time using extractYearFromEnum
    return data;
  } catch (error) {
    console.error('Error in getStudents:', error);
    return { students: [] };
  }
}

// Helper function to convert number to enum value format with year_ prefix
export function formatGraduationYearForApi(year: number): string {
  if (!year) return "";
  return `year_${year}`;
}

// Helper function to extract year from enum value with year_ prefix
export function extractYearFromEnum(enumValue: string): number | null {
  if (!enumValue) return null;
  const match = enumValue.match(/year_(\d{4})/);
  return match ? parseInt(match[1], 10) : null;
}

export async function getProjects({
  studentId,
  assignmentId,
  learningPathId,
  languageId,
  projectType,
  featured,
}: {
  studentId?: string;
  assignmentId?: string;
  learningPathId?: string;
  languageId?: string;
  projectType?: string;
  featured?: boolean;
}) {
  try {
    // Create a clean variables object with only the variables that are used
    const variables: Record<string, any> = {};
    
    // Build the where clause parts
    let whereClauseParts = [];
    
    if (studentId && studentId !== 'all') {
      // Updated to use students (plural) with some condition
      whereClauseParts.push('students: { some: { id: { equals: $studentId } } }');
      variables.studentId = studentId;
    }
    
    if (assignmentId && assignmentId !== 'all') {
      whereClauseParts.push('assignment: { id: { equals: $assignmentId } }');
      variables.assignmentId = assignmentId;
    }
    
    if (learningPathId && learningPathId !== 'all') {
      whereClauseParts.push('learningPath: { id: { equals: $learningPathId } }');
      variables.learningPathId = learningPathId;
    }
    
    if (languageId && languageId !== 'all') {
      whereClauseParts.push('languages: { some: { id: { equals: $languageId } } }');
      variables.languageId = languageId;
    }
    
    if (projectType && projectType !== 'all') {
      whereClauseParts.push('projectType: { equals: $projectType }');
      variables.projectType = projectType;
    }
    
    if (featured === true) {
      whereClauseParts.push('featured: { equals: true }');
    }
    
    // Join the where clause parts
    const whereClause = whereClauseParts.length > 0
      ? `where: { ${whereClauseParts.join(', ')} }`
      : '';

    // Build variable definitions based on what's actually used
    const variableDefinitions = [];
    if ('studentId' in variables) variableDefinitions.push('$studentId: ID');
    if ('assignmentId' in variables) variableDefinitions.push('$assignmentId: ID');
    if ('learningPathId' in variables) variableDefinitions.push('$learningPathId: ID');
    if ('languageId' in variables) variableDefinitions.push('$languageId: ID');
    if ('projectType' in variables) variableDefinitions.push('$projectType: ProjectProjectTypeType');

    const variableDefString = variableDefinitions.length > 0
      ? `(${variableDefinitions.join(', ')})`
      : '';

    const query = `
      query GetProjects${variableDefString} {
        projects${whereClause ? ` (${whereClause})` : ''} {
          id
          title
          description {
            document
          }
          projectType
          demoUrl
          embedCode
          featured
          createdAt
          students {
            id
            name
            class {
              name
            }
            graduationYear
          }
          languages {
            id
            name
          }
          assignment {
            id
            title
          }
          learningPath {
            id
            title
          }
          screenshots {
            id
            caption
            image {
              url
              width
              height
              filesize
            }
          }
        }
      }
    `;

    console.log("GraphQL Query:", query);
    console.log("GraphQL Variables:", variables);

    // Make the request
    const data = await fetchGraphQL(query, variables);
    console.log("GraphQL Response:", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error in getProjects:', error);
    
    // Return empty data structure to avoid further errors
    return { projects: [] };
  }
}

// Updated getProjectById to include graduationYear
export async function getProjectById(id: string) {
  const query = `
    query GetProject($id: ID!) {
      project(where: { id: $id }) {
        id
        title
        description {
          document
        }
        projectType
        deliverableType
        demoUrl
        embedCode
        featured
        createdAt
        students {
          id
          name
          class {
            id
            name
          }
          graduationYear
        }
        languages {
          id
          name
        }
        assignment {
          id
          title
          description {
            document
          }
          learningObjectives {
            id
            title
            description
            order
          }
        }
        learningPath {
          id
          title
          description {
            document
          }
          assignments {
            id
            title
            orderInPath
            learningObjectives {
              id
              title
              description
              order
            }
          }
        }
        screenshots {
          id
          caption
          image {
            url
            width
            height
            filesize
          }
        }
        codeFiles {
          id
          description
          file {
            filename
            url
            filesize
          }
        }
        zipArchives {
          id
          description
          extractedPath
          archive {
            filename
            url
            filesize
          }
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL(query, { id });
    console.log("GetProjectById Response:", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error in getProjectById:', error);
    return { project: null };
  }
}

// Query to get all programming languages
export async function getProgrammingLanguages() {
  const query = `
    query GetProgrammingLanguages {
      programmingLanguages {
        id
        name
      }
    }
  `;

  return fetchGraphQL(query);
}

export async function getAssignments() {
  const query = `
    query GetAssignments {
      assignments {
        id
        title
        description {
          document
        }
        dueDate
        learningObjectives {
          id
          title
          description
          order
        }
        learningPath {
          id
          title
        }
        screenshots {
          id
          caption
          image {
            url
            width
            height
            filesize
          }
        }
      }
    }
  `;

  return fetchGraphQL(query);
}

// Get assignment by ID with detailed learning objectives
export async function getAssignmentById(id: string) {
  const query = `
    query GetAssignment($id: ID!) {
      assignment(where: { id: $id }) {
        id
        title
        description {
          document
        }
        learningObjectives {
          id
          title
          description
          order
        }
        dueDate
        orderInPath
        learningPath {
          id
          title
          assignments {
            id
            title
            orderInPath
          }
        }
        files {
          id
          title
          description
          fileType
          file {
            filename
            url
            filesize
          }
        }
        screenshots {
          id
          caption
          image {
            url
            width
            height
            filesize
          }
        }
        projects {
          id
          title
          deliverableType
          students {
            name
            class {
              name
            }
            graduationYear
          }
          screenshots {
            image {
              url
            }
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query, { id });
  console.log("GetAssignmentById Response:", JSON.stringify(data, null, 2));
  return data;
}

// Get classes for filtering
export async function getClasses() {
  const query = `
    query GetClasses {
      classes {
        id
        name
      }
    }
  `;

  return fetchGraphQL(query);
}

// Updated getLearningPaths
export async function getLearningPaths() {
  const query = `
    query GetLearningPaths {
      learningPaths {
        id
        title
        description {
          document
        }
        coverImage {
          url
          width
          height
        }
        createdAt
        assignments {
          id
          title
          orderInPath
          learningObjectives {
            id
            title
            description
            order
          }
        }
      }
    }
  `;

  return fetchGraphQL(query);
}

// Updated getLearningPathById to include graduationYear
export async function getLearningPathById(id: string) {
  const query = `
    query GetLearningPath($id: ID!) {
      learningPath(where: { id: $id }) {
        id
        title
        description {
          document
        }
        coverImage {
          url
          width
          height
        }
        createdAt
        createdBy {
          name
        }
        assignments {
          id
          title
          description {
            document
          }
          learningObjectives {
            id
            title
            description
            order
          }
          dueDate
          orderInPath
          screenshots {
            id
            caption
            image {
              url
              width
              height
            }
          }
        }
        projects {
          id
          title
          students {
            id
            name
            class {
              name
            }
            graduationYear
          }
          screenshots {
            image {
              url
            }
          }
          deliverableType
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL(query, { id });
    
    // Filter final projects in JavaScript rather than in GraphQL
    if (data.learningPath && data.learningPath.projects) {
      data.learningPath.projects = data.learningPath.projects.filter(
        (project: Project) => project.deliverableType === 'final'
      );
    }
    
    console.log("GetLearningPathById Response:", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error in getLearningPathById:', error);
    return { learningPath: null };
  }
}

// Function to create or update a student with proper graduationYear handling
export async function createOrUpdateStudent(studentData: {
  id?: string;
  name: string;
  email?: string;
  classId?: string;
  graduationYear?: number;
}) {
  // Format graduation year for the API if it exists
  const formattedGraduationYear = studentData.graduationYear 
    ? formatGraduationYearForApi(studentData.graduationYear)
    : null;

  const variables: any = {
    name: studentData.name,
    email: studentData.email || null,
    classId: studentData.classId || null,
    graduationYear: formattedGraduationYear,
  };

  // If updating an existing student
  if (studentData.id) {
    const query = `
      mutation UpdateStudent(
        $id: ID!
        $name: String!
        $email: String
        $classId: ID
        $graduationYear: StudentGraduationYearType
      ) {
        updateStudent(
          where: { id: $id }
          data: {
            name: $name,
            email: $email,
            class: { connect: { id: $classId } },
            graduationYear: $graduationYear
          }
        ) {
          id
          name
          email
          graduationYear
          class {
            id
            name
          }
        }
      }
    `;
    
    return fetchGraphQL(query, { ...variables, id: studentData.id });
  } 
  // If creating a new student
  else {
    const query = `
      mutation CreateStudent(
        $name: String!
        $email: String
        $classId: ID
        $graduationYear: StudentGraduationYearType
      ) {
        createStudent(
          data: {
            name: $name,
            email: $email,
            class: { connect: { id: $classId } },
            graduationYear: $graduationYear
          }
        ) {
          id
          name
          email
          graduationYear
          class {
            id
            name
          }
        }
      }
    `;
    
    return fetchGraphQL(query, variables);
  }
}