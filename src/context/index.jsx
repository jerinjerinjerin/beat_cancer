import { 
     createContext, 
     useCallback, 
     useContext, 
     useState 
    } from "react";
import { db } from "../utils/dbConfig";
import { Users, Records } from "../utils/schema";

import { eq } from "drizzle-orm";

// Create context
const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [records, setRecords] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      const result = await db.select().from(Users).execute();
      setUsers(result);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  }, []);

  // Fetch user by email
  const fetchUserByEmail = useCallback(async (email) => {
    try {
      const result = await db
        .select()
        .from(Users)
        .where(eq(Users.createBy, email))
        .execute();

      if (result.length > 0) {
        setCurrentUser(result[0]);
      }
    } catch (error) {
      console.error("Error fetching user by email", error);
    }
  }, []);

  // Create a new user
  const createUser = useCallback(async (userData) => {
    try {
      const newUser = await db
        .insert(Users)
        .values(userData)
        .returning()
        .execute();
  
      setUsers((prevUsers) => [...prevUsers, newUser[0]]);
      
      // Return the newly created user
      return newUser[0];
    } catch (error) {
      console.error("Error creating user", error);
      return null;
    }
  }, []);
  
  //fetchUserRecords

  const fetchUserRecords = useCallback(async (userEmail) => {
    try {
      const result = await db
        .select()
        .from(Records)
        .where(eq(Records.createBy, userEmail))
        .execute();

      setRecords(result);
    } catch (error) {
      console.log("Error fetching user records", error);
    }
  }, []);

  const createRecords = useCallback(async (recordData) => {
    try {
      const newRecord = await db
        .insert(Records)
        .values(recordData)
        .returning({ id: Records.id })
        .execute();

      setRecords((prevRecords) => [...prevRecords, newRecord[0]]);
      return newRecord[0];
    } catch (error) {
      console.error("Error creating record", error);
      return null;
    }
  }, []);

  const updateRecord = useCallback(async (recordData) => {
    try {
      const { documentId, ...dataToUpdate } = recordData;

      const updateRecords = await db
        .update(Records)
        .set(dataToUpdate)
        .where(eq(Records.id, documentId))
        .returning();

      setRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.id === documentId ? updateRecord[0] : record,
        ),
      );
    } catch (error) {
      console.error("Error creating record", error);
      return null;
    }
  }, []);

  return (
    <StateContext.Provider
      value={{
        users,
        records,
        currentUser,
        fetchUsers,
        fetchUserByEmail,
        createUser,
        fetchUserRecords,
        createRecords,
        updateRecord
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Export the context for use in other components
export const useStatecontext = () => useContext(StateContext)
