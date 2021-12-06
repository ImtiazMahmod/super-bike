import { Container, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Spinner from "../../Shared/Spinner/Spinner";
import SingleBike from "./SingleBike/SingleBike";

const Collection = () => {
  const [bikes, setBikes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //load all bikes
  useEffect(() => {
    axios
      .get("https://nameless-fortress-10028.herokuapp.com/bikes")
      .then((res) => {
        setBikes(res.data);
        setIsLoading(false);
      });
  }, []);
  return (
    <Box sx={{ minHeight: "100vh", my: 12 }}>
      <Typography color="tomato">DISCOVER YOUR</Typography>
      <Typography fontWeight="bold" variant="h4">
        {" "}
        BIKE RANGE
      </Typography>
      {isLoading ? (
        <Spinner />
      ) : (
        <Container>
          <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
            {/* show only 6 bikes */}
            {bikes?.slice(0, 6).map((bike) => (
              <Grid key={bike._id} item xs={4} sm={4} md={4}>
                <SingleBike bike={bike} />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </Box>
  );
};

export default Collection;
