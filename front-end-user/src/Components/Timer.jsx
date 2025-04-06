import React from 'react';
import { Grid, Typography, Paper , Box, Button,  } from '@mui/material';

function Timer() {
 
  return (
    <div>
    
  <Grid container spacing={1} sx={{width:"96%",margin:"auto"}} >
      {/* First row with 2 columns */}
      <Grid item xs={6}>
        <img src="assets/images/home/2.png" alt="image1" style={{ width: '100%' }} />
      </Grid>
      <Grid item xs={6}>
        <img src="assets/images/home/3.png" alt="image2" style={{ width: '100%' }} />
      </Grid>

      {/* Second row with 3 columns */}
      <Grid item xs={4}>
        <img src="assets/images/home/4.png" alt="image3" style={{ width: '100%' }} />
      </Grid>
      <Grid item xs={4}>
        <img src="assets/images/home/5.png" alt="image4" style={{ width: '100%' }} />
      </Grid>
      <Grid item xs={4}>
        <img src="assets/images/home/8.png" alt="image5" style={{ width: '100%' }} />
      </Grid>

      {/* Third row with 3 columns */}
      <Grid item xs={4}>
        <img src="assets/images/home/6.png" alt="image6" style={{ width: '100%' }} />
      </Grid>
      <Grid item xs={4}>
        <img src="assets/images/home/7.png" alt="image7" style={{ width: '100%' }} />
      </Grid>
      <Grid item xs={4}>
        <img src="assets/images/home/1.png" alt="image8" style={{ width: '100%' }} />
      </Grid>
    </Grid>



    <Grid container spacing={1}  sx={{width:"96%",margin:"auto"}}>
      {/* First row with 2 columns */}
      <Grid item xs={6}>
        <img src="assets/images/home/9.png" alt="image1" style={{ width: '100%' }} />
      </Grid>
      <Grid item xs={6}>
        <img src="assets/images/home/10.png" alt="image2" style={{ width: '100%' }} />
      </Grid>

      {/* Second row with 2 columns */}
      <Grid item xs={6}>
        <img src="assets/images/home/11.png" alt="image3" style={{ width: '100%' }} />
      </Grid>
      <Grid item xs={6}>
        <img src="assets/images/home/12.png" alt="image4" style={{ width: '100%' }} />
      </Grid>
    </Grid>


    <Grid container spacing={1} sx={{width:"96%",margin:"auto"}}>
      {/* Single column */}
      <Grid item xs={12}>
        <img src="assets/images/home/13.png" alt="image" style={{ width: '100%' }} />
      </Grid>
    </Grid>



<Grid sx={{width:"96%",margin:"auto"}}>
    <Typography sx={{fontWeight:"bold",fontSize:"20px"}}  >Orginal</Typography>
    <Grid container spacing={1} >
     
  {[
    { id: 1, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/900_20240330120217596.png' },
    { id: 2, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/800.png' },
    { id: 3, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/112_20240330120138406.png' },
    { id: 4, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/110_20240330120322752.png' },
    { id: 5, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/110_20240330120322752.png' },
    { id: 6, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/107_20240330120337162.png' },
  ].map((image, index) => (
    <Grid item xs={4} sm={4} md={4} lg={4} key={image.id}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={image.src}
          alt={`image${image.id}`}
          style={{ width: 'auto', maxWidth: '100%', height: 'auto', maxHeight: '100%' }}
        />
      </div>
    </Grid>
  ))}
</Grid>

</Grid>

<Grid sx={{width:"96%",margin:"auto"}}>
<Typography sx={{fontWeight:"bold",fontSize:"20px"}}  >Orginal</Typography>
    <Grid container spacing={1} >
     
  {[
    { id: 1, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/800.png' },
    { id: 2, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/JDB/7006.png' },
    { id: 3, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/EVO_Electronic/harlecoin0000000.png' },
    { id: 4, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/EVO_Electronic/kitchendrqfrenzy.png' },
    { id: 5, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/EVO_Electronic/warofgods0000000.png' },
    { id: 6, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/V8Card/8910.png' },
  ].map((image, index) => (
    <Grid item xs={4} sm={4} md={4} lg={4} key={image.id}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={image.src}
          alt={`image${image.id}`}
          style={{ width: '124px', maxWidth: '100%', height: '174px', maxHeight: '100%' }}
        />
      </div>
    </Grid>
  ))}
</Grid>
</Grid>
<Grid sx={{width:"96%",margin:"auto"}}>
<Typography sx={{fontWeight:"bold",fontSize:"20px"}}  >Orginal</Typography>
    <Grid container spacing={1} >
     
  {[
    { id: 1, src: 'https://ossimg.envyenvelope.com/daman/vendorlogo/vendorlogo_2024011618151716a4.png' },
    { id: 2, src: 'https://ossimg.envyenvelope.com/daman/vendorlogo/vendorlogo_202401161814358lat.png' },
    { id: 3, src: 'https://ossimg.envyenvelope.com/daman/vendorlogo/vendorlogo_20240116181633lq6j.png' },
    { id: 4, src: 'https://ossimg.envyenvelope.com/daman/vendorlogo/vendorlogo_20240116181623alci.png' },
    { id: 5, src: 'https://ossimg.envyenvelope.com/daman/vendorlogo/vendorlogo_20240116181611q84s.png' },
    { id: 6, src: 'https://ossimg.envyenvelope.com/daman/vendorlogo/vendorlogo_20240116181455tg16.png' },
  ].map((image, index) => (
    <Grid item xs={4} sm={4} md={4} lg={4} key={image.id}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={image.src}
          alt={`image${image.id}`}
          style={{ width: '124px', maxWidth: '100%', height: '174px', maxHeight: '100%' }}
        />
      </div>
    </Grid>
  ))}
</Grid>
</Grid>
<Grid sx={{width:"96%",margin:"auto"}}>
<Typography sx={{fontWeight:"bold",fontSize:"20px"}}  >Orginal</Typography>
    <Grid container spacing={1} >
     
  {[
    { id: 1, src: 'https://ossimg.envyenvelope.com/daman/vendorlogo/vendorlogo_20240116181202hhjt.png' },
    { id: 2, src: 'https://ossimg.envyenvelope.com/daman/vendorlogo/vendorlogo_20240116181151vd4w.png' },
    { id: 3, src: 'https://ossimg.envyenvelope.com/daman/vendorlogo/vendorlogo_20240116181140kbrq.png' },
    { id: 4, src: 'https://ossimg.envyenvelope.com/daman/vendorlogo/vendorlogo_20240116181011v5fb.png' },
    { id: 5, src: 'https://ossimg.envyenvelope.com/daman/vendorlogo/vendorlogo_20240116180850im3d.png' },
    
  ].map((image, index) => (
    <Grid item xs={4} sm={4} md={4} lg={4} key={image.id}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={image.src}
          alt={`image${image.id}`}
          style={{ width: '125px', maxWidth: '100%', height: '174px', maxHeight: '100%' }}
        />
      </div>
    </Grid>
  ))}
</Grid>
</Grid>

<Grid sx={{width:"96%",margin:"auto"}}>
<Typography sx={{fontWeight:"bold",fontSize:"20px"}}  >Orginal</Typography>
    <Grid container spacing={1} >
     
  {[
    { id: 1, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/EVO_Video/CrazyTime0000001.png' },
    { id: 2, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/EVO_Video/AmericanTable001.png' },
    { id: 3, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/EVO_Video/48z5pjps3ntvqc1b.png' },
    { id: 4, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/AG_Video/ROU_EN.png' },
    { id: 5, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/EVO_Video/AndarBahar000001.png' },
    { id: 6, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/EVO_Video/BacBo00000000001.png' },
  ].map((image, index) => (
    <Grid item xs={4} sm={4} md={4} lg={4} key={image.id}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={image.src}
          alt={`image${image.id}`}
          style={{ width: 'auto', maxWidth: '100%', height: 'auto', maxHeight: '100%' }}
        />
      </div>
    </Grid>
  ))}
</Grid>
</Grid>
<Grid sx={{width:"96%",margin:"auto"}}>
<Typography sx={{fontWeight:"bold",fontSize:"20px"}}  >Orginal</Typography>
<Grid container spacing={1}>
  {[
    { id: 1, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/CQ9/AB3.png' },
    { id: 2, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/CQ9/AT01.png' },
    { id: 3, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/CQ9/AT05.png' },
    { id: 4, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/CQ9/GO02.png' },
    { id: 5, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/JDB/7001.png' },
    { id: 6, src: 'https://ossimg.envyenvelope.com/daman/gamelogo/JDB/7002.png' },
  ].map((image, index) => (
    <Grid item xs={4} sm={4} md={4} lg={4} key={image.id}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgb(255,142,137)', // Add this line
        }}
      >
        <img
          src={image.src}
          alt={`image${image.id}`}
          style={{ width: '124px', maxWidth: '100%', height: '174px', maxHeight: '100%' }}
        />
      </div>
    </Grid>
  ))}
</Grid>
</Grid>

<Grid sx={{width:"96%",margin:"auto"}}>
<Typography sx={{fontWeight:"bold",fontSize:"20px"}}  >Orginal</Typography>
    <Grid container spacing={1} >
     
  {[
    { id: 1, src: 'https://ossimg.envyenvelope.com/daman/vendorlogo/vendorlogo_202401161815294l5u.png' },
    { id: 2, src: 'https://ossimg.envyenvelope.com/daman/vendorlogo/vendorlogo_202401161815398gx3.png' },
    
  ].map((image, index) => (
    <Grid item xs={4} sm={4} md={4} lg={4} key={image.id}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={image.src}
          alt={`image${image.id}`}
          style={{ width: 'auto', maxWidth: '100%', height: 'auto', maxHeight: '100%' }}
        />
      </div>
    </Grid>
  ))}
</Grid>
</Grid>


</div>

);
}
export default Timer;







