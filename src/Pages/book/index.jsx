import React, { useEffect, useState } from "react";
import { defaultFilter, RecordsPerPage } from "../../constant";
import { productStyle } from "./style";
import { useNavigate } from "react-router-dom";
import bookService from "../../service/BookService";
import categoryService from "../../service/CategoriesService";
import { toast } from "react-toastify";
import Shared from "../../utils/shared";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
// import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import ConfirmationDialog from "../../component/ConfirmationDialog";


const Book = () => {
    const classes = productStyle();
  const [filters, setFilters] = useState(defaultFilter);
  const [bookRecords, setBookRecords] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = async () => {
    await categoryService.getAll().then((res) => {
      if (res) {
        setCategories(res.data.result);
      }
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllBooks({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const searchAllBooks = (filters) => {
    bookService.getAll(filters).then((res) => {
      setBookRecords(res.data.result);
    });
  };
  const onConfirmDelete = () => {
    bookService
      .deleteBook(selectedId)
      .then((res) => {
        toast.success(Shared.messages.DELETE_SUCCESS);
        setOpen(false);
        setFilters({ ...filters, pageIndex: 1 });
      })
      .catch((e) => toast.error(Shared.messages.DELETE_FAIL));
  };

  const columns = [
    { id: "name", label: "Book Name", minWidth: 100 },
    { id: "price", label: "Price", minWidth: 100 },
    { id: "category", label: "Category", minWidth: 100 },
  ];
  return (
    <div className={classes.productWrapper}>
        <div className="container">
    <h5 className="Book-page text-center mb-5 mt-5">Book Page</h5>
    <div className="search-head-container">
    <div className="search-book-container">
        <input
          type="text"
          id="text"
          placeholder="Search..."
          className="search-add-field"
          onChange={(e) => {
            setFilters({ ...filters, keyword: e.target.value, pageIndex: 1 });
          }}
          name="text"
        />
        <button
          className=" add-btn"
          type="submit"
          onClick={() => navigate("/add-book")}
        >
          Add
        </button>
      </div>
    </div>
      
      <TableContainer >
        <Table  aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookRecords?.items?.map((row, index) => (
              <TableRow key={row.index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>
                  {categories.find((c) => c.id === row.categoryId)?.name}
                </TableCell>
                <TableCell align="right"  >
                  <button
                    className=" edit-btn"
                    type="button"
                    onClick={() => {
                      navigate(`/edit-book/${row.id}`);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn "
                    type="button"
                    onClick={() => {
                      setOpen(true);
                      setSelectedId(row.id ?? 0);
                    }}
                  >
                    Delete
                  </button>
                </TableCell>
                
              </TableRow>
            ))}
            {!bookRecords.items.length && (
                <TableRow className="TableRow">
                  <TableCell colSpan={5} className="TableCell">
                   <p> No Books</p>
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination 
          rowsPerPageOptions={RecordsPerPage}
          component="div"
          count={bookRecords.totalItems}
          rowsPerPage={filters.pageSize || 0}
          page={filters.pageIndex - 1}
          onPageChange={(e, newPage) => {
            setFilters({ ...filters, pageIndex: newPage + 1 });
          }}
          onRowsPerPageChange={(e) => {
            setFilters({
              ...filters,
              pageIndex: 1,
              pageSize: Number(e.target.value),
            });
          }}
        />
        <ConfirmationDialog
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => onConfirmDelete()}
          title="Delete book"
          description="Are you sure you want to delete this book?"
        />
        
    </div>
    </div>
    
  );
};

export default Book;
