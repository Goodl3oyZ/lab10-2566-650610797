"use client";

import { cleanUser } from "@/libs/cleanUser";
import axios from "axios";
import { useEffect, useState } from "react";
import { UserCard } from "@/components/UserCard";

export default function RandomUserPage() {
  //user = null or array of object
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [genAmount, setGenAmount] = useState(1);
  const [isFirstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      setFirstLoad(false);
      return;
    }
    localStorage.setItem("genAmount", genAmount);
  }, [genAmount]);

  useEffect(() => {
    const strGenAmount = localStorage.getItem("genAmount");
    if (genAmount == null || genAmount == "") {
      setGenAmount(0);
      localStorage.setItem("genAmount", 0);
    }
    setGenAmount(strGenAmount);
  });

  const generateBtnOnClick = async () => {
    setIsLoading(true);

    const resp = await axios.get(
      `https://randomuser.me/api/?results=${genAmount}`
    );
    setIsLoading(false);
    const users = resp.data.results;
    const cleanedUser = users.map(cleanUser); //สร้างตัวแปรมารับค่า user แต่ละตัวที่ผ่านฟังก์ชัน cleanUser แล้ว
    setUsers(cleanedUser);
    console.log(cleanedUser); // check ดูว่ามันได้มาครบไหม
  };

  return (
    <div style={{ maxWidth: "700px" }} className="mx-auto">
      <p className="display-4 text-center fst-italic m-4">Users Generator</p>
      <div className="d-flex justify-content-center align-items-center fs-5 gap-2">
        Number of User(s)
        <input
          className="form-control text-center"
          style={{ maxWidth: "100px" }}
          type="number"
          onChange={(e) => setGenAmount(e.target.value)}
          value={genAmount}
        />
        <button className="btn btn-dark" onClick={generateBtnOnClick}>
          Generate
        </button>
      </div>
      {isLoading && (
        <p className="display-6 text-center fst-italic my-4">Loading ...</p>
      )}
      {users &&
        !isLoading &&
        //เอาแต่ละตัวในusersไปเข้าฟังก์ชัน Usercard โดยกำหนดค่าที่จะเข้าไป
        //กำหนดค่า key ด้วยซึ่งควรเป็นค่าที่บ่งบอกว่าแต่ละ arrays ต่างกันเพื่อให้มันรันเร็วขึ้นเฉยๆ
        users.map((user) => (
          <UserCard
            name={user.name}
            imgUrl={user.imgUrl}
            address={user.address}
            email={user.email}
            key={user.email}
          />
        ))}
    </div>
  );
}
