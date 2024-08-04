export const fetchUsers = async (page = 1, limit = 5) => {
  const response = await fetch(
    `https://dummyjson.com/users?skip=${(page - 1) * limit}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
