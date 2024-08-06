/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLast,
  PaginationFirst,
} from "@/components/ui/pagination";
import { fetchUsers } from "../../app/utils/service";
import { MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  email: string;
  role: string;
  image: string;
  phone: string;
  bloodGroup: string;
  address: {
    address: string;
    country: string;
  };
};

const TablePage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const limit = 5;

  const { data, error, isLoading } = useQuery({
    queryKey: ["users", page],
    queryFn: () => fetchUsers(page, limit),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const users: User[] = data?.users || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink isActive={i === page} onClick={() => setPage(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      pageNumbers.push(
        <PaginationItem key={1}>
          <PaginationLink isActive={page === 1} onClick={() => setPage(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (page > 3) {
        pageNumbers.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(totalPages - 1, page + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink isActive={i === page} onClick={() => setPage(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (page < totalPages - 2) {
        pageNumbers.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      pageNumbers.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={page === totalPages}
            onClick={() => setPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pageNumbers;
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };

  return (
    <div className="py-20 lg:px-72 md:px-16 sm:px-2 ">
      <div className="flex justify-center items-center font-bold text-2xl pb-5">
        <h1>User Table</h1>
      </div>
      {/* Table Section */}
      <Table className="border border-spacing-2">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex justify-start items-center">
                  <img
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div className="grid">
                    <span className="font-semibold">
                      {user.firstName} {user.maidenName} {user.lastName}
                    </span>
                    <span className="font-base">{user.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                <div className="flex justify-start items-center gap-4">
                  <IoEyeOutline
                    className="cursor-pointer text-green-600"
                    size={18}
                    onClick={() => handleViewUser(user)}
                  />
                  <AiOutlineEdit
                    className="cursor-pointer text-blue-600"
                    size={18}
                  />
                  <MdDeleteOutline
                    className="cursor-pointer text-red-600"
                    size={18}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Pagination Section */}
      <Pagination className="mt-8 flex justify-center items-center lg:gap-5 md:gap-3 sm:gap-0 ">
        <PaginationFirst
          className="cursor-pointer"
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          aria-disabled={page === 1}
        />
        <PaginationPrevious
          className="cursor-pointer"
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          aria-disabled={page === 1}
        />
        <PaginationContent>{renderPageNumbers()}</PaginationContent>
        <PaginationNext
          className="cursor-pointer"
          onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
          aria-disabled={page === totalPages}
        />
        <PaginationLast
          className="cursor-pointer"
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          aria-disabled={page === 1}
        />
      </Pagination>

      {/* Modal Section */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="opaque"
        placement="center"
        className="h-100 w-100 p-5 bg-slate-100"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 p-2">
                User Details
              </ModalHeader>

              <ModalBody>
                {selectedUser && (
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={selectedUser.image}
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      className="w-32 h-32 rounded-full"
                    />
                    <div className="grid justify-center items-center gap-2">
                      <p>
                        <strong>Name:</strong> {selectedUser.firstName}{" "}
                        {selectedUser.maidenName} {selectedUser.lastName}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedUser.email}
                      </p>
                      <p>
                        <strong>Blood Group:</strong> {selectedUser.bloodGroup}
                      </p>
                      <p>
                        <strong>Phone:</strong> {selectedUser.phone}
                      </p>
                      <p>
                        <strong>Role:</strong> {selectedUser.role}
                      </p>
                      <p>
                        <strong>Address:</strong> {selectedUser.address.address}
                        , {selectedUser.address.country}
                      </p>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="mt-10">
                <div className="flex justify-end items-end">
                  <Button
                    className="rounded-md"
                    color="primary"
                    onPress={onClose}
                  >
                    Close
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TablePage;
