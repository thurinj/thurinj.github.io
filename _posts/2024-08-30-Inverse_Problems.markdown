---
layout: default
title:  "Inverse problems"
date:   2024-07-20 00:43:14 +1000
categories: jekyll update
---
# Inverse problems

Here is a very general introduction to inverse problems, which I hope will be helpful to you. Through my undergrad and grad studies, I have been lucky to find plenty of excellent resources on the topic online, and I hope to contribute to it with my own words here, hoping to pass the torch along.



### Inverse?
What is an **inverse problem** in the first place? In a nutshell, an inverse problem is a problem driven by observations. It is like a game of Clue, where the goal is to infer, guess, or estimate *what* generated those observations. This class of problems is ubiquitous in science and engineering. It can be found in a wide range of fields, from earth sciences, medical imaging, and computer science to logistics, finance, and economics, to name a few. As their name suggests, inverse problems are somehow linked to what we call **forward problems**. In a forward problem, we know the cause and we want to predict the effect. Given a model (a set of rules driving a system), some initial conditions, we can predict the outcome. The inverse problem works backward: given the outcome, and knowing some of the rules, we want to infer the initial conditions or the model that produced it.

One great visual and oversimplistic analogy would be to compare the forward and inverse problems in the context of Baking a cake:

- *Forward Problem*: You have access to a recipe (the model), a set of ingredients and baking temperature (initial conditions). You follow the recipe step by step to bake a cake (the outcome). This is straightforward—given the instructions and ingredients, you can predict the final product - which if you don't mess up, should be a delicious cake.

- *Inverse Problem*: Now, suppose you come across a beautifully baked cake but without knowing the recipe. You want to reverse-engineer the process: what ingredients were used, and in what quantities? What steps were followed to achieve that result? This is much more challenging because multiple recipes could potentially produce similar cakes. You enter the territory of *uncertainty*, *educated guesses*, *approximations* and *probabilities*.

And how would you know if you have guessed right? You would need to bake the cake yourself and compare the results with some sort of criteria (we will talk soon about a *metric*). This is where **data** comes into play. In the context of inverse problems, data is the key to validate your guesses and refine your model. The more data you have, the more constraints you can put on your model, and the more accurate your predictions will be.

### Optimization

The classical way of tackling inverse problem, is to frame it as a numerical optimization procedure. Essentially, we're looking out for the best possible solution that aligns with our observations and adheres to the underlying model (i.e., the perfect copy of the Chef's cake you are trying to reproduce). This is where the concept of **misfit function**, or **objective function** (which is our **metric**) comes into play. 

To make this clear, let's define our objective function as the following minimization problem:

$$ \min_{\mathbf{x}} \left\| \mathbf{A}\mathbf{x} - \mathbf{b} \right\|^2  $$

where:
- $\mathbf{A}$ is the forward operator
- $\mathbf{x}$ is the parameter vector we want to estimate
- $\mathbf{b}$ is the observed data
- $\left\|\left\| \cdot \right\|\right\|^2$ is the norm that measures the discrepancy between predicted and observed data.

Back to baking! In our analogy, the forward model $\mathbf{A}$ represents the recipe. It dictates how different ingredients (the parameters of our inverse problem) combine under certain conditions (like baking temperature) to produce the final cake. Mathematically, $\mathbf{A}$ transforms the parameter vector $\mathbf{x}$ (ingredient quantities) into the predicted outcome $\mathbf{Ax}$  (cake characteristics).

The parameter vector $\mathbf{x}$ is the set of all the quantities of each ingredient used in the cake. For example $\mathbf{x} = \left[x_1, x_2, x_3, x_4\right]$ could represent the amounts of flour, sugar, eggs, etc., needed to bake the cake. 

The observed data $\mathbf{b}$ corresponds to the characteristics of the final cake you have—its taste, obviously, but it could also be texture, color, and other attributes. These are the outcomes you observe and wish to match by adjusting the ingredient quantities. You see from here that the observation you make is crucial in defining the complexity of the problem. If you only have a vague idea of what the cake should look like, you might end up with a very different recipe than the original one, due to the lack of constraints you impose on your optimization problem.


### Putting It All Together

In the inverse problem scenario, you're given $\mathbf{b}$ (the Chef's cake) and $\mathbf{A}$ (the general idea of the recipe), but you need to determine $\mathbf{x}$ (the specific ingredient quantities) that would produce a cake matching your observations. The optimization task involves finding the $\mathbf{x}$ that minimizes the difference between $\mathbf{Ax}$ (the predicted cake characteristics based on your guessed ingredients) and $\mathbf{b}$ (the actual cake you have).

Replace $\mathbf{A}$ by the wave equation, and $\mathbf{b}$ with a seismogram, and you will quickly be looking at a seismic tomography problem, where the goal is now to infer the Earth's structure ($\mathbf{x}$) from seismic waves traveling through it.

## Global vs Local Optimization methods

When solving inverse problems, one of the critical decisions is choosing the right optimization method. Broadly, these methods fall into two categories: *global optimization* and *local optimization*. Understanding the differences between these approaches is essential for selecting the most appropriate method for a given problem, as unfortunately, there is no such thing as a one-size-fits-all optimization algorithm.

### Global optimization
Global optimization methods aim to find the best possible solution within the entire search space (also "misfit space" or "solution space"). They are designed to avoid getting trapped in local optima—solutions that are better than their immediate neighbors but not the best overall. If there is such a thing as the best overall solution for a problem, global optimization is designed to find it. They are generally quite robust but also computationally demanding, as they need to explore a large number of solutions to ensure they have found the best one. They are usually not recommended when the number of parameters to estimate is "large." How large exactly is subject to interpretation and might vary from one problem to another, but in general, global optimization methods can become computationally prohibitive as the number of parameters grows (that's the [curse of dimensionality](https://en.wikipedia.org/wiki/Curse_of_dimensionality)), often becoming impractical beyond a few dozen parameters depending on the specific method and problem structure. Some popular methods you might have heard of are:

1. [Simulated annealing](https://en.wikipedia.org/wiki/Simulated_annealing)
2. [Particle swarm optimization](https://en.wikipedia.org/wiki/Particle_swarm_optimization)
3. [Genetic algorithms](https://en.wikipedia.org/wiki/Genetic_algorithm)
4. [Grid search](https://en.wikipedia.org/wiki/Brute-force_search) (or exhaustive search, bruteforce search)

Some of these methods (1-3) are inspired by natural phenomena or specific patterns in nature and fall into the category of **metaheuristic** optimization methods, which I hope to cover in a future post (more specifically, I would like to discuss some of the methods from the brilliant [Evolutionary Computation Bestiary](https://github.com/fcampelo/EC-Bestiary) that [Felipe Campelo](https://github.com/fcampelo) has put together). The last method (4) is more general and can be applied to a wide range of problems, but suffers from the exponential growth in possible combinations.

**Baking analogy!** Applied to our cake-copy problem, a global optimization method would require you to try out many  combinations of available ingredients to find the best recipe that matches your observations. While it might not be a big deal if you could instantly bake a cake and taste it, it is a totally different story if you have to work for several hours to bake each cake: Due to the generally high number of estimates to make, global optimization methods are generally not recommended if the forward problem is very computationally expensive.

<div style="height: 0px;"></div>

### Local optimization
Local optimization methods, on the other hand, are designed to find the best solution in the immediate vicinity of the starting point. Essentially, they are operating within a limited portion of the search space. They are generally faster than global optimization methods, but they are also more likely to get stuck in local optima. If the best overall solution is not in the vicinity of your search region (your first guess), you probably won't be able to find it with a local optimization method. While they are not able to guarantee finding the global minimum, most of them have the advantage of being able to exploit the local structure of the search space (like slope and curvature of the objective function), which can lead to faster convergence. Some popular methods you might have heard of are:

1. [Gradient descent](https://en.wikipedia.org/wiki/Gradient_descent)
2. [Newton's method](https://en.wikipedia.org/wiki/Newton%27s_method_in_optimization)
3. [Levenberg-Marquardt](https://en.wikipedia.org/wiki/Levenberg%E2%80%93Marquardt_algorithm)
4. [Conjugate gradient](https://en.wikipedia.org/wiki/Conjugate_gradient_method)
5. [Quasi-Newton methods](https://en.wikipedia.org/wiki/Quasi-Newton_method)

When using the gradient of the objective function to guide the search, these methods are called **gradient-based** optimization methods (or first order methods). When they use the Hessian (second derivative of the objective function), they are called **second-order** methods. The latter are generally more computationally expensive, but they can provide more information about the local structure of the search space, which can lead to faster convergence, and potentially uncertainty estimation by estimating the local curvature of the misfit function in the vicinity of the solution.

**Baking analogy!** Applied to our cake-copy problem, a local optimization method would require you to adjust the quantities of ingredients in your recipe based on the taste of the cake you have just baked. You would then taste the cake again and adjust the recipe again, and so on, until you are satisfied with the result. This is a much faster process than trying out a huge number of ingredients combinations, but you might end up with a cake that is not as good as the one you could have made with a global optimization method. If your initial cake (i.e., the first guess that defines the local search region) is not close to the cake you are trying to copy, you will probably end up with a suboptimal recipe.

<hr style="border: 1px solid   #8caba1; width: 100%;">

## Conclusion

If you are not familiar with inverse problems or optimization methods, I hope this very general introduction has given you a taste of what they are about. The field of inverse problems is vast, and I've only scratched the surface here. I have left out misfit functions, regularization, machine learning, uncertainty quantification, Bayesian inference, and many more topics. 

For beginners who might be reading this, I recommend starting with a simple problem and trying to solve it with a local optimization method. This will give you a good understanding of the basic concepts and challenges of inverse problems. Once you are comfortable with the basics, you can start exploring more advanced topics and methods.

And as for some useful reference, here are some (mostly free) resources you might want to check out:

- [Kalman and Bayesian filter in Python](https://github.com/rlabbe/Kalman-and-Bayesian-Filters-in-Python): An e-book written by Roger R. Labbe. While strictly speaking, the book is about Data Assimilation, it essentially is a different spin on classical inverse problems (it is basically inverse problems for dynamic systems). It is a fantastic introduction to the topic, with lots of very concrete examples written in Python.
- [Algorithms for Optimization](https://algorithmsbook.com/optimization/): This book is published by MIT press and available freely online. It covers a wide range of topic, but mostly focuses on the algorithm to solve optimization problems. It is a great resource if you are interested in the numerical side of inverse problems.
- [Inverse Problem Theory](https://www.geologie.ens.fr/~jolivet/Research_files/Tarantola.pdf): written by the late Albert Tarantola, this is THE reference book for inverse problem theory in geophysics. It covers practically everything. While I would not necessarily recommend it as a first read for a beginner, it is a must have reference. And for a great piece of Earth's science and web history combined, here is Albert Tarantola's [original web page](http://web.archive.org/web/20230601164217/https://www.ipgp.fr/~tarantola/) archived on the [Internet Archive](http://web.archive.org/) wayback machine.
- [Optimal State Estimation, Kalman, Hoo, and Nonlinear Approaches](https://isharifi.ir/teaching/2019/IoT/%5BDan_Simon%5D_Optimal_State_Estimation_Kalman,_H_In%28BookFi%29.pdf): A book by Dan Simon. While it is mostly about Kalman filtering, it is also a great introduction to the topic of statistical filtering / parameter estimation. Inverse problems are, after all, very reminiscent of estimation theory and filtering.
- [Numerical Optimization](https://www.math.uci.edu/~qnie/Publications/NumericalOptimization.pdf): A book by Jorge Nocedal and Stephen J. Wright. This one is also focused on the numerical aspect of optimization. It gives an exhaustive overview of the practical aspects of optimization, and the sections on 2nd order optimization are particularly brilliant. A must if you want to implement your own optimization algorithms.