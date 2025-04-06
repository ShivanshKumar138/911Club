import React, { useState } from "react";
import { Grid, Divider, Pagination,Box } from "@mui/material";

const CustomTable = ({ data }) => {
  const pageSize = 10;
  const [page, setPage] = useState(0);

  const columns = [
    { id: "period", label: "Period", width: "35%" },
    { id: "number", label: "Number", width: "15%" },
    { id: "big_small", label: "Big Small", width: "30%" },
    { id: "color", label: "Color", width: "20%" },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedData = data.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <Grid container px={0} >
{columns.map((column, index) => (
      <Grid
        item
        key={column.id}
        sx={{
          width: column.width,
          background: "#F95959", // Changed to a golden yellow color
          color: "white",
          padding: "2.5% 5.8%",
          borderTopLeftRadius: index === 0 ? "10px" : "0",
          borderTopRightRadius: index === columns.length - 1 ? "10px" : "0",
          fontWeight: "bold",
          display: "flex",
          fontSize: "0.9rem",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {column.label}
      </Grid>
    ))}
      <Divider />
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        backgroundColor="#ffffff"
      >
        {paginatedData.map((row) => (
          <React.Fragment key={row.id}>
            <Grid
              item
              xs={3}
              sx={{
                padding: "8px",
                // borderBottom: '1px solid #ccc',
                display: "flex",
                alignItems: "center",
                justifyContent: "left",
                fontSize: "0.8rem",
                color: "#666",
                fontWeight: "bold"
              }}
            >
              {row.periodId.toString()}
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                padding: "8px",
                // borderBottom: '1px solid #ccc',
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                textAlign: "right",
                justifyContent: "right",
                paddingRight: "5%",
                background:
                  Array.isArray(row.colorOutcome) &&
                  row.colorOutcome.length === 2
                    ? `linear-gradient(to bottom, ${
                        row.colorOutcome[0] === "red"
                          ? "rgb(253,86,92)"
                          : row.colorOutcome[0] === "green"
                          ? "rgb(64,173,114)"
                          : row.colorOutcome[0]
                      } 50%, ${
                        row.colorOutcome[1] === "red"
                          ? "rgb(253,86,92)"
                          : row.colorOutcome[1] === "green"
                          ? "rgb(64,173,114)"
                          : row.colorOutcome[1]
                      } 50%)`
                    : row.colorOutcome[0] === "red"
                    ? "rgb(253,86,92)"
                    : row.colorOutcome[0] === "green"
                    ? "rgb(64,173,114)"
                    : row.colorOutcome[0],
                WebkitBackgroundClip: "text",
                color: "transparent",
                fontSize: "1.7rem",
              }}
            >
              {row.numberOutcome}
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                padding: "8px",
                // borderBottom: '1px solid #ccc',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textTransform: "capitalize",
                fontSize: "13.5px",
                color: "#666",
                fontWeight: "bold"
              }}
            >
              {row.sizeOutcome}
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                padding: "5px",
                // borderBottom: '1px solid #ccc',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {Array.isArray(row.colorOutcome) ? (
                row.colorOutcome.map((color, index) => (
                  <div
                    key={index}
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor:
                        color === "red"
                          ? "rgb(253,86,92)"
                          : color === "green"
                          ? "rgb(64,173,114)"
                          : color,
                      marginRight:
                        index < row.colorOutcome.length - 1 ? "5px" : "0",
                    }}
                  />
                ))
              ) : (
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: row.colorOutcome,
                  }}
                />
              )}
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
      <Box
  sx={{
    width:"100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
    backgroundColor: "#f0f0f0",
    padding: { xs: "10px", sm: "15px" },
    borderRadius: "0 0 10px 10px",
  }}
>
  <Pagination
    count={Math.ceil(data.length / pageSize)}
    page={page}
    onChange={handleChangePage}
    size="small"
    siblingCount={1}
    boundaryCount={1}
    sx={{
      '& .MuiPagination-ul': {
        flexWrap: 'nowrap',
      },
      "& .MuiPaginationItem-root": {
        color: "#000",
        fontSize: { xs: "0.7rem", sm: "0.8rem" },
        margin: "0 1px",
        minWidth: { xs: "24px", sm: "28px" },
        height: { xs: "24px", sm: "28px" },
      },
      "& .MuiPaginationItem-page": {
        borderRadius: "4px",
        "&:hover": {
          backgroundColor: "#e0e0e0",
        },
      },
      "& .MuiPaginationItem-page.Mui-selected": {
        color: "#fff",
        backgroundColor: "#F95959",
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: "#0a4f11",
        },
      },
      "& .MuiPaginationItem-ellipsis": {
        color: "#000",
        backgroundColor: "transparent",
      },
      "& .MuiPaginationItem-previousNext": {
        backgroundColor: "#F95959",
        color: "#ffffff",
        borderRadius: "4px",
        minWidth: { xs: "24px", sm: "28px" },
        height: { xs: "24px", sm: "28px" },
        "&:hover": {
          backgroundColor: "#0a4f11",
        },
      },
      "& .MuiPaginationItem-icon": {
        fontSize: "1rem",
      },
    }}
  />
</Box>
    </Grid>
  );
};

export default CustomTable;