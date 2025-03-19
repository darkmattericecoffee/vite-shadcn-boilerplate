// src/lib/api.ts
export const API_URL = 'http://localhost:3000/api/graphql';
export const API_BASE_URL = 'http://localhost:3000';

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

// Query to get all projects with filtering options
// Update to the getProjects function in src/lib/api.ts

export async function getProjects({
  studentId,
  assignmentId,
  languageId,
  projectType,
  featured,
}: {
  studentId?: string;
  assignmentId?: string;
  languageId?: string;
  projectType?: string;
  featured?: boolean;
}) {
  // Create a clean variables object with only the variables that are used
  const variables: Record<string, any> = {};
  
  // Build the where clause parts
  let whereClauseParts = [];
  
  if (studentId && studentId !== 'all') {
    whereClauseParts.push('student: { id: { equals: $studentId } }');
    variables.studentId = studentId;
  }
  
  if (assignmentId && assignmentId !== 'all') {
    whereClauseParts.push('assignment: { id: { equals: $assignmentId } }');
    variables.assignmentId = assignmentId;
  }
  
  if (languageId && languageId !== 'all') {
    whereClauseParts.push('languages_some: { id: { equals: $languageId } }');
    variables.languageId = languageId;
  }
  
  if (projectType && projectType !== 'all') {
    whereClauseParts.push('projectType: { equals: $projectType }');
    variables.projectType = projectType;
  }
  
  if (featured !== undefined) {
    whereClauseParts.push('featured: { equals: $featured }');
    variables.featured = featured;
  }
  
  // Join the where clause parts
  const whereClause = whereClauseParts.length > 0
    ? `where: { ${whereClauseParts.join(', ')} }`
    : '';

  // Build variable definitions based on what's actually used
  const variableDefinitions = [];
  if ('studentId' in variables) variableDefinitions.push('$studentId: ID');
  if ('assignmentId' in variables) variableDefinitions.push('$assignmentId: ID');
  if ('languageId' in variables) variableDefinitions.push('$languageId: ID');
  if ('projectType' in variables) variableDefinitions.push('$projectType: String');
  if ('featured' in variables) variableDefinitions.push('$featured: Boolean');

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
        student {
          id
          name
          class
        }
        languages {
          id
          name
        }
        assignment {
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
}


// Query to get all students
export async function getStudents() {
  const query = `
    query GetStudents {
      students {
        id
        name
        class
        graduationYear
      }
    }
  `;

  return fetchGraphQL(query);
}

// Query to get all assignments
export async function getAssignments() {
  const query = `
    query GetAssignments {
      assignments {
        id
        title
        dueDate
      }
    }
  `;

  return fetchGraphQL(query);
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

// Query to get a single project by ID
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
        demoUrl
        embedCode
        featured
        createdAt
        student {
          id
          name
          class
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

  const data = await fetchGraphQL(query, { id });
  console.log("GetProjectById Response:", JSON.stringify(data, null, 2));
  return data;
}