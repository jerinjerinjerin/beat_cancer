import React, { useEffect, useState } from "react";
import RecordCard from "./components/record-card";
import CreateRecordModel from "./components/create-record-model";
import { useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useStatecontext } from "../../context";
import { IconCirclePlus } from "@tabler/icons-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = usePrivy();
  const { records, fetchUserRecords, createRecords, fetchUserByEmail, currentUser } =
    useStatecontext();

  const [userRecords, setUserRecords] = useState([]);
  const [isModalOpen, setIsModelOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserByEmail(user?.email?.address);
      fetchUserRecords(user?.email?.address);
    }
  }, [user, fetchUserByEmail, fetchUserRecords]);

  useEffect(() => {
    setUserRecords(records);
    localStorage.setItem('userRecords', JSON.stringify(records));
  }, [records]);

  const handleOpenModel = () => {
    setIsModelOpen(true);
  };

  const handleCloseModel = () => {
    setIsModelOpen(false);
  };

  const createFolder = async (foldername) => {
    try {
      if (currentUser) {
        const email = user?.email?.address;
        console.log("User Email:", email); // Debugging line to check the email value

        if (!email) {
          throw new Error("User email is not available.");
        }

        const newRecord = await createRecords({
          userId: currentUser?.id,
          recordName: foldername,
          analysisResult: 'Pending analysis',
          kanbanRecords: '',
          createBy: email,
        });

        if (newRecord) {
          fetchUserRecords(email);
          handleCloseModel();
        }
      }
    } catch (error) {
      console.error("Error creating record:", error);
      handleCloseModel();
    }
  };

  const handleNavigate = (name) => {
    const filteredRecords = userRecords.filter(
      (record) => record.recordName === name
    );

    navigate(`/medical-records/${name}`, {
      state: filteredRecords[0]
    });
  };

  return (
    <div className="flex flex-wrap gap-[26px]">
      <button
        className="mt-6 inline-flex items-center gap-x-2 rounded-full border border-neutral-700 bg-[#13131a] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800"
        type="button"
        onClick={handleOpenModel}
      >
        <IconCirclePlus /> Create Record
      </button>
      <CreateRecordModel
        isOpen={isModalOpen}
        onClose={handleCloseModel}
        onCreate={createFolder}
      />
      <div className="grid w-full sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {userRecords.map((record) => (
          <RecordCard
            key={record.id} // Use a unique identifier
            record={record}
            onNavigate={handleNavigate}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
