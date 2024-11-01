---
layout: default
title:  "Intro to Moment Tensor Inversion"
date:   2024-10-23 00:43:14 +1000
categories: jekyll update
---

This introduction is a brief overview of the moment tensor inversion problem as handled by the `MTUQ` package. It is directly copied from the Google Colab notebook that I used for the [SCOPED 2024 Workshop](https://seisscoped.org/workshop-2024/) session on moment tensor inversion. The notebook can be found [here](https://colab.research.google.com/drive/1UJWOompBz9MlJN0B6SoVKzF8Whz_1nPp?usp=sharing).

<small>Please reach out to me if you have any issues or questions about the content of the Colab notebook.</small>

<hr style="border: 1px solid   #8caba1; width: 100%;">
<!-- vertical space -->
<div style="height: 30px;"></div>

# Introduction to Moment tensor inversion with the Cut-and-Paste method

In this brief introduction, we will see what the moment tensor inversion problem is about. This should cover all the theory you should be familiar with before handling MTUQ, starting with:

### The seismic moment tensor

The seismic moment tensor $\mathbf{M}$ is a mathematical representation of the motion applied to a point-sized seismic source. It is a $3 \times 3$ second-order symmetric tensor with 6 independent parameters.

<figure>
<center>
<img src="https://github.com/thurinj/thurinj.github.io/blob/master/images/Workshop_Figures_2024/Moment_tensor.png?raw=true" width="400" height="400" alt="Representation of the double couple on a fault">
<figcaption>Representation of the moment tensor $\mathbf{M}$ components in terms of linear vector dipoles and force couples. From <a href="https://www.wiley.com/en-au/An+Introduction+to+Seismology%2C+Earthquakes%2C+and+Earth+Structure-p-9780865420786">Stein & Wysession (2002)</a>.</figcaption>
</center>
</figure>

In the ideal case of a motion applied onto a perfect fault-plane, it can be represented by a supperposition of force-couples or dipoles (with zero net-torque):

<figure>
<center>
<img src="https://github.com/thurinj/thurinj.github.io/blob/master/images/Workshop_Figures_2024/Double-couple.png?raw=true" width="400" height="140" alt="Representation of the double couple on a fault">
<figcaption>Motion on an ideal fault plane represented as double-couples. From <a href="https://www.wiley.com/en-au/An+Introduction+to+Seismology%2C+Earthquakes%2C+and+Earth+Structure-p-9780865420786">Stein & Wysession (2002)</a>.</figcaption>
</center>
</figure>

Therefore, by estimating the moment tensor parameters for seismic sources that fall into the point-source approximation we can learn about their geometrical properties, and the general motion that was applied to the subsurface - generating seismic waves.

<hr style="border: 1px solid   #8caba1; width: 100%;">

A moment tensor can be conveniently represented as the so-called *beachball*, which is a representation of the P-wave first motions in 3D space (binary representation of the P-waves radiation pattern). The color of the beachball reflects the direction of motion applied in different directions. It is generally white for motion pointing inward and black (or color shaded) for motion pointing outward of the unit sphere.

<figure>
<center>
<img src="https://github.com/thurinj/thurinj.github.io/blob/master/images/Workshop_Figures_2024/DC.gif?raw=true" width="400" height="400" alt="Gif of a moment tensor in 3D with vector field for the motion">
<figcaption>Vector field representation of the motion associated with double-couple point source. represented as a 'beachball'. Courtesy of <a href="https://mxrap.com/2019/07/26/moment-tensors-a-practical-guide/">Stuart Tierney</a>.</figcaption>
</center>
</figure>

Most of the time, moment tensor "beachballs" are visualized as 2D diagrams. These diagrams are stereonet projections of the lower hemisphere of the unit sphere, as seen from above in a map view. This representation allows for easier interpretation and analysis, as it conveys the general motion on a fault at a glance, or the source type in the case of non double-couple sources.

<figure>
<center>
<img src="https://s3.amazonaws.com/pnsn-cms-uploads/attachments/000/000/782/original/fc3a5caddf34f183f09a2382cb05136d" width="400" alt="A few key moment tensor and fault block-models.">
<figcaption>Common double couple moment tensor and associated fault block-models <a href="https://www.usgs.gov/media/images/schematic-diagram-focal-mechanism">USGS</a>.</figcaption>
</center>
</figure>



<hr style="border: 1px solid   #8caba1; width: 100%;">
### Moment tensor parameterization and the Lune diagram

Moment tensors attributes can be broadly defined as *source type* and *orientation*, which are both informed by the geometrical properties of the tensor. Given a moment tensor $\mathbf{M}$, whose eigvenvalues $(\lambda_1, \lambda_2, \lambda_3)$ satisfy $\lambda_1 \geq \lambda_2 \geq \lambda_3$, we can represent a moment tensor as its eigendecomposition:

$\mathbf{M} = \mathbf{U \Lambda U}^T$

where $\mathbf{U}$ contains the eigenvectors that satisfies $\mathbf{UU}^T = \mathbf{I}$, and $\mathbf{\Lambda}$ is the diagonal matrix containing the eigenvalue triple in descending order.

With this decomposition in mind, we see that $\mathbf{U}$ encodes the source orientation (the tensor's eigenframe), and $\mathbf{\Lambda}$ encodes the source type. From this decomposition stems a very natural way of representing source-types, by projecting the tensor position on the eigenvalue lune:

<figure>
<center>
<img src="https://github.com/thurinj/thurinj.github.io/blob/master/images/Workshop_Figures_2024/Eigenvalue_lune_definition.png?raw=true" width="600" height="200" alt="Geometry of the eigenvalue lune">
<figcaption>Definition of the eigenvalue lune as a set of ordered and normalized eigenvalues. From <a href="https://drive.google.com/file/d/1-B37EEHRp-ZpycFYVGj3TRUFOy3H0VoJ/view">Tape & Tape 2019</a>.</figcaption>
</center>
</figure>

In the following example, we show for 4 fixed eigenframes, how the moment-tensor source type changes as a function of $\mathbf{\Lambda}$ only:

<figure>
<center>
<img src="https://github.com/thurinj/thurinj.github.io/blob/master/images/Workshop_Figures_2024/4Lunes.png?raw=true" width="600" height="320" alt="4 moment tensor lunes">
<figcaption>Moment-tensor source type plot for a set of 4 fixed source orientations. For a fixed orientation, the location on the eigenvalue lune controls the source type. From <a href="https://sites.google.com/alaska.edu/carltape/home/research/beachball_gallery?authuser=0">Carl Tape</a> figure gallery.</figcaption>
</center>
</figure>

In `MTUQ`, we adopt a moment-tensor parameterization that exploits the geometrical properties of the moment tensor so that we explore the moment-tensor space in a uniform manner. Instead of exploring the 6 parameters of the moment tensor directly, we will express moment tensors with the following set of coordinates:

* $γ, δ$ for the eigenvalue triple, $γ$ being the lune longitude and $δ$ the lune latitude,
* $κ, σ, θ$ for the orientaion, where $κ$, $σ$, $θ$ are for strike, dip and, slip angles respectively.
* $ρ$ gives the scalar seismic moment $M_0 = ρ \sqrt{2}^{-1}$

such that we have $\mathbf{M}(ρ, γ, δ, κ, σ, θ)$.

For more details, you can read <a href="https://drive.google.com/file/d/1s41vK795cncM_IeTI617Y3GaZ6mVbQhp/view">Tape & Tape (2015)</a>.

### Moment tensor inversion
In `MTUQ` we solve the moment tensor inversion problem by finding the source that minimizes the following cost function:

$C(\mathbf{M}) = \sum_{r=1}^{N} \sum_{i=1}^{3} \int_0^T \left[d_i^r(t,\mathbf{M}) - d_i^{r,obs}(t)\right]^2 dt$

which translates to the sum of least-squares waveform difference between the synthetic waveforms $d(t)$ and the observed data $d^{obs}(t)$ for N stations with 3 components.

In order to speed up the optimization process, we rely on a set of pre-computed Green's functions $\mathbf{G}^r$ between each source-receiver pair $r$, such that we can recast the problem as

$C(\mathbf{M}) = \sum_{r=1}^{N} \sum_{i=1}^{3} \int_0^T \left[\mathbf{G}_i^r \mathbf{m} - d_i^{r,obs}\right]^2 dt$

where the time dependency has been dropped for convenience, and $\mathbf{m}$ is a vector containing the 6 independent parameters of the Moment tensor $\mathbf{M}$. Using pre-computed Green's functions allows the rapid evaluation of the residual term, which we simplify as:

$\mathbf{r} = \mathbf{Gm} - \mathbf{d}$

which is less expensive than explicitly modeling the waveform for each source in a given earth model.

### The Cut-and-paste method

The algorithm underlying `MTUQ` is known as the "cut-and-paste" (CAP)method of <a href="https://doi.org/10.1785/BSSA0860051634"> Zhu & Helmberger (1996)</a>.

The main goal of the CAP method is to mitigate the effects of 3-D velocity structures that are unaccounted for with a 1D reference model (or an inexact 3D model).

It does so by splitting all the data into specific window groups (typically P-waves and Surface waves) and allowing a time-shift window for the synthetics. Within this allowable time-shift window, a cross-correlation is performed between $d_{syn}$ and $d_{obs}$, and the residual is computed only for the maximum cross-correlation value (when signals are supposedly aligned).

<figure>
<center>
<img src="https://github.com/thurinj/thurinj.github.io/blob/master/images/Workshop_Figures_2024/CAP.gif?raw=true" width="600" height="320" alt="Illustration of the cut and paste method.">
<figcaption>Illustration of the cut and paste method.</figcaption>
</center>
</figure>

We do this for each data group (P, Rayleigh, Love waves), for each station and each component (Z-R-T), and return one misfit value corresponding to the maximum cross-correlation value.