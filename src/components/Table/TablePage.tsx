"use client";

import React, { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
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

type User = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  email: string;
  role: string;
  image: string;
};

const TablePage: React.FC = () => {
  const [page, setPage] = useState(1);
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

  return (
    <div className="py-20 px-44 ">
      <div className="flex justify-center items-center font-bold text-2xl pb-5">
        <h1>User Table</h1>
      </div>
      <Table className="border border-spacing-2">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>
                <div className="flex justify-start items-center">
                  <img
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div className="grid">
                    {/* <Image src={user?.image} alt="img" width={5} height={5} /> */}

                    <span className="font-semibold">
                      {user.firstName} {user.maidenName} {user.lastName}
                    </span>
                    <span className="font-base">{user.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.age}</TableCell>
              <TableCell>
                <div className="flex justify-start items-center gap-4">
                  <IoEyeOutline
                    className="cursor-pointer text-green-600"
                    size={18}
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
      <Pagination className="mt-4">
        <PaginationFirst
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          aria-disabled={page === 1}
        />
        <PaginationPrevious
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          aria-disabled={page === 1}
        />
        <PaginationContent>{renderPageNumbers()}</PaginationContent>
        <PaginationNext
          onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
          aria-disabled={page === totalPages}
        />

        <PaginationLast
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          aria-disabled={page === 1}
        />
      </Pagination>
    </div>
  );
};

export default TablePage;
