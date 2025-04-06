import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Pagination,
  Tabs,
  Divider,
  Tab,
  TableRow,
  Paper,
  Typography,
  Box,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const chart = [];
// Styled Components

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "4px 4px",
  borderBottom: "none",
  fontSize: "12px",
  "&:last-child": {
    paddingRight: "5px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "& td, & th": {
    borderBottom: "none",
  },
}));

const StyledTab = styled(Tab)(({ selected, index }) => ({
  minWidth: selected ? "52px" : "25px",
  padding: "4px 16px",
  fontWeight: "bold",
  fontSize: "16px",
  color: selected ? "transparent" : "#768096",
  backgroundColor: selected ? "#ffffff" : "#f6f6f6",
  backgroundImage: selected ? `url(${chart[index]})` : "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  borderRadius: "20px 20px 0px 0px",
  margin: "0 2.5px",
}));

const TabWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  padding: "16px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
}));

const NumberTableWithLines = ({ paginatedData, selectedTab }) => {
  const isSmallScreen = useMediaQuery("(max-width:500px)");
  const isMiddleScreen = useMediaQuery("(max-width:600px)");
  const columns = [
    { id: "period", label: "Period", width: isMiddleScreen ? "50%" : "30%" },
    { id: "result", label: "Number", width: isMiddleScreen ? "50%" : "70%" },
  ];

  const renderNumbers = (sectionOutcome) => {
    return [...Array(10).keys()].map((num) => {
      const isHighlighted = Object.keys(sectionOutcome).some((key) => {
        const { number } = sectionOutcome[key];
        return number === num && key === String.fromCharCode(65 + selectedTab); // Check if the number matches and tab is selected
      });

      return (
        <Box sx={{ maxWidth: "90%" }}>
          <div
            key={num}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "left",
            }}
          >
            <div
              style={{
                width: "13.5px",
                height: "15px",
                borderRadius: "50%",
                border: "1px solid grey",
                display: "flex",
                fontSize: "10px",
                alignItems: "center",
                justifyContent: "center",
                margin: isSmallScreen ? "0 2px" : "0 1.8px",
                aspectRatio: "1 / 1",
                background: isHighlighted ? "#0F5518" : "transparent",
                color: isHighlighted ? "white" : "grey",
              }}
            >
              {num}
            </div>
            {num >= 9 && (
              <div
                key={num}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "left",
                }}
              >
                <div
                  style={{
                    background:
                      sectionOutcome[String.fromCharCode(65 + selectedTab)]
                        .number > 4
                        ? "#FEAA57"
                        : "#6EA8F4",
                    color: "white",
                    fontSize: "15px",
                    width: "14px",
                    height: "15px",
                    borderRadius: "50%",
                    marginLeft: isSmallScreen ? "5px" : "10px",
                    display: "flex",
                    fontSize: "10px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {sectionOutcome[String.fromCharCode(65 + selectedTab)]
                    .number > 4
                    ? "H"
                    : "L"}
                </div>
                <div
                  style={{
                    background:
                      sectionOutcome[String.fromCharCode(65 + selectedTab)]
                        .number %
                        2 ===
                      0
                        ? "#transparent"
                        : "#18B660",
                    color:
                      sectionOutcome[String.fromCharCode(65 + selectedTab)]
                        .number %
                        2 ===
                      0
                        ? "#C86EFF"
                        : "white",
                    fontSize: "15px",
                    width: "14px",
                    height: "15px",
                    borderRadius: "50%",
                    marginLeft: "1px",
                    border:
                      sectionOutcome[String.fromCharCode(65 + selectedTab)]
                        .number %
                        2 ===
                      0
                        ? " 1px solid #C86EFF"
                        : "",
                    display: "flex",
                    fontSize: "10px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {sectionOutcome[String.fromCharCode(65 + selectedTab)]
                    .number %
                    2 ===
                  0
                    ? "E"
                    : "O"}
                </div>
              </div>
            )}
          </div>
        </Box>
      );
    });
  };

  return (
    <Grid container px={0} sx={{ mt: 4 }}>
      {columns.map((column, index) => (
        <Grid
          item
          key={column.id}
          sx={{
            width: column.width,
            background: "#F95959",
            color: "white",
            padding: "2.3% 5.6%",
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
        alignItems="left"
        backgroundColor="#ffffff"
        sx={{
          borderRadius: "10px",
          justifyContent: isSmallScreen
            ? "space-evenly"
            : isMiddleScreen
            ? "space-evenly"
            : "space-between",
        }}
      >
        <div className="relative">
          {paginatedData.map((row, rowIndex) => {
            const sectionOutcome = row.sectionOutcome;

            return (
              <Box sx={{ width: "90%", my: 2, alignItems: "left" }}>
                <Box
                  key={row.periodId}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    position: "relative",
                    paddingBottom: "5px",
                    mt: 3, // Allows wrapping for smaller screens
                  }}
                >
                  <Box
                    style={{
                      fontSize: isSmallScreen ? "10px" : "12px",
                      color: "black",
                      paddingLeft: isSmallScreen
                        ? "0%"
                        : isMiddleScreen
                        ? "-4%"
                        : "5%",
                    }}
                  >
                    {row.periodId}
                  </Box>
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "right",
                      paddingLeft: isSmallScreen
                        ? "3%"
                        : isMiddleScreen
                        ? "10%"
                        : "12%",
                    }}
                  >
                    {renderNumbers(sectionOutcome)}
                  </Box>

                  {/* Uncomment if you need the SVG path rendering */}
                  {rowIndex < paginatedData.length - 1 && (
                    <svg
                      style={{
                        position: "absolute",
                        top: -2,
                        left: isSmallScreen
                          ? "65px"
                          : isMiddleScreen
                          ? "100px"
                          : "115px",
                        overflow: "visible",
                        transform: "rotate(3deg)",
                      }}
                    >
                      <path
                        d={`M${
                          sectionOutcome[String.fromCharCode(65 + selectedTab)]
                            ?.number *
                            20 +
                          13
                        } 20.5 
             ${
               paginatedData[rowIndex + 1].sectionOutcome[
                 String.fromCharCode(65 + selectedTab)
               ]?.number *
                 20 +
               13
             } 50`} // Adjusted Y coordinate
                        stroke="#0F5518"
                        fill="transparent"
                      />
                    </svg>
                  )}
                </Box>
              </Box>
            );
          })}
        </div>
      </Grid>
    </Grid>
  );
};

const Chart5D = ({ data }) => {
  const { rows, statisticsData } = data;
  const pageSize = 10;
  const [page, setPage] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentStatisticsData, setCurrentStatisticsData] =
    useState(statisticsData);

  useEffect(() => {
    // Update currentStatisticsData when selectedTab changes
    const newStatisticsData = statisticsData.map((row) => ({
      ...row,
      cols: row.cols.map(() => Math.floor(Math.random() * 50) + 1), // Generate new random values
    }));
    setCurrentStatisticsData(newStatisticsData);
  }, [selectedTab, statisticsData]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedData = rows.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        margin: "auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <TabWrapper>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          TabIndicatorProps={{ style: { display: "none" } }}
        >
          {["A", "B", "C", "D", "E"].map((label, index) => (
            <StyledTab
              key={index}
              label={selectedTab === index ? "" : label}
              selected={selectedTab === index}
              index={selectedTab === index ? index : ""}
            />
          ))}
        </Tabs>
        <Divider sx={{ backgroundColor: "grey" }} />
        <Box sx={{ marginTop: "16px" }}>
          <Typography variant="body2" sx={{ mb: 1, textAlign: "start" }}>
            Statistic (last 100 Periods)
          </Typography>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ backgroundColor: "transparent", boxShadow: "none" }}
          >
            <Table size="small">
              <TableBody>
                {currentStatisticsData.map((row, rowIndex) => (
                  <StyledTableRow key={rowIndex}>
                    <StyledTableCell component="th" scope="row">
                      {row.label}
                    </StyledTableCell>
                    {row.cols.map((col, colIndex) => (
                      <StyledTableCell key={colIndex} align="center">
                        {col}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </TabWrapper>

      <NumberTableWithLines
        paginatedData={paginatedData}
        selectedTab={selectedTab}
      />

      {/* Pagination Section */}
      <Box
        sx={{
          width: "90%",
          display: "flex",
          justifyContent: "center",
          marginTop: "10px",
          backgroundColor: "#f0f0f0",
          padding: { xs: "10px", sm: "15px" },
          borderRadius: "0 0 10px 10px",
        }}
      >
        <Pagination
          count={Math.ceil(rows.length / pageSize)}
          page={page}
          onChange={handleChangePage}
          size="small"
          siblingCount={1}
          boundaryCount={1}
          sx={{
            "& .MuiPagination-ul": {
              flexWrap: "nowrap",
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
              backgroundColor: "#4782ff",
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
              backgroundColor: "#4782ff",
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
    </Box>
  );
};

export default Chart5D;
