import React, { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Pagination,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material"

const NumberCircle = styled(Box)(() => ({
  width: 20,
  height: 20,
  borderRadius: "50%",
  // border: "2px solid white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 1px",
  backgroundColor: "white",
}))

const ResultCircle = styled(Box)(({ bgcolor }) => ({
  width: 15,
  height: 15,
  borderRadius: "10%",
  backgroundColor: bgcolor,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 2px",
  color: "#fff",
  fontSize: "0.7rem",
  fontWeight: "bold",
}))

const HeaderCell = styled(Box)({
  padding: "12px",
  textAlign: "center",
  color: "white",
  fontWeight: "bold",
})

const RaceHistory = ({ data = [] }) => {
  const [page, setPage] = useState(1)
  const itemsPerPage = 10
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const getCarImage = (number) => {
    return `/assets/ball/speed_pinball${number}.webp`
  }

  const getBSColor = (value) => {
    return value === "Big"
      ? "linear-gradient(90deg, #FF9000 0%, #FFD000 100%)"
      : "linear-gradient(90deg, #00BDFF 0%, #5BCDFF 100%)"
  }

  const getOEColor = (value) => {
    return value === "Odd"
      ? "linear-gradient(90deg, #FD0261 0%, #FF8A96 100%)"
      : "linear-gradient(90deg, #00BE50 0%, #9BDF00 100%)"
  }

  const handlePageChange = (event, value) => {
    setPage(value)
    console.log("value", value)
  }

  const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <Card sx={{ maxWidth: "100%", bgcolor: "#222121" }}>
      <CardContent sx={{ p: 0 }}>
        <Grid container sx={{ bgcolor: "#40392e" }}>
          <Grid item xs={4}>
            <HeaderCell>Period</HeaderCell>
          </Grid>
          <Grid item xs={3}>
            <HeaderCell>Result</HeaderCell>
          </Grid>
          <Grid item xs={2.5}>
            <HeaderCell>B/S</HeaderCell>
          </Grid>
          <Grid item xs={2.5}>
            <HeaderCell>O/E</HeaderCell>
          </Grid>
        </Grid>

        {paginatedData.map((item) => (
          <Grid
            container
            key={item._id}
            sx={{
              py: 1,
              borderBottom: "1px solid #eee",
              "&:last-child": { borderBottom: 0 },
              alignItems: "center",
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
            }}
          >
            <Grid item xs={4.3} sx={{ textAlign: "center" }}>
              <Typography variant="body2" sx={{fontSize: "12.288px", fontWeight: "400", color: "#fff"}}>{item.periodId}</Typography>
            </Grid>

            <Grid item xs={3} sx={{ display: "flex", justifyContent: "center" }}>
              {["firstPlace", "secondPlace", "thirdPlace"].map((pos) => (
                <NumberCircle key={pos}>
                  <img
                    src={getCarImage(item.positions[pos].carNumber)}
                    alt={`Car ${item.positions[pos].carNumber}`}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "50%",
                    }}
                  />
                </NumberCircle>
              ))}
            </Grid>

            <Grid item xs={2.2} sx={{ display: "flex", justifyContent: "center" }}>
              {["firstPlace", "secondPlace", "thirdPlace"].map((pos) => (
                <ResultCircle
                  key={pos}
                  sx={{ background: getBSColor(item.positions[pos].size) }}
                >
                  {item.positions[pos].size[0]}
                </ResultCircle>
              ))}
            </Grid>

            <Grid item xs={2.2} sx={{ display: "flex", justifyContent: "center" }}>
              {["firstPlace", "secondPlace", "thirdPlace"].map((pos) => (
                <ResultCircle
                  key={pos}
                  sx={{ background: getOEColor(item.positions[pos].parity) }}
                >
                  {item.positions[pos].parity[0]}
                </ResultCircle>
              ))}
            </Grid>
          </Grid>
        ))}

        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <Pagination
            count={Math.ceil(data.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            size={isMobile ? "small" : "medium"}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#000",
                "&.Mui-selected": {
                  bgcolor: "#40392e",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#40392e",
                  },
                },
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default RaceHistory