"use client";

import { CollaborativeEditor } from "./Editor";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { FormEvent, useEffect, useState, useTransition } from "react";
import Avatars from "./Avatars";
import InviteUser from "./InviteUser";
import ManageUsers from "./ManageUsers";
import useOwner from "@/lib/useOwner";
import DeleteDocument from "./DeleteDocument";

function Document({ id }: { id: string }) {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const isOwner = useOwner();
  const [input, setInput] = useState("");
  const [isUpdating, startTransition] = useTransition();

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      startTransition(async () => {
        await updateDoc(doc(db, "documents", id), {
          title: input,
        });
      });
    }
  };

  return (
    <div className="flex-1 h-full bg-white p-5">
      <div className="flex max-w-6xl mx-auto justify-between pb-5">
        <form className="flex flex-1 space-x-2" onSubmit={updateTitle}>
          <Input value={input} onChange={(e) => setInput(e.target.value)} />

          <Button type="submit" disabled={!input || isUpdating}>
            {isUpdating ? "Updating…" : "Update"}
          </Button>

          {isOwner && (
            <>
              <InviteUser />
              <DeleteDocument />
            </>
          )}
        </form>
      </div>

      <div className="flex max-w-6xl mx-auto justify-between items-center mb-5">
        <ManageUsers />

        <Avatars />
      </div>

      <hr className="pb-10" />

      <CollaborativeEditor />
    </div>
  );
}

export default Document;
