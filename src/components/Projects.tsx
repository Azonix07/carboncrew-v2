import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const projects = [
	{
		title: 'GameSpot Shop Automation',
		category: 'Automation',
		description:
			'Complete shop automation system for GameSpot, streamlining inventory management, order processing, and business operations.',
		tags: ['Automation', 'Python', 'Integration'],
		image:
			'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
		color: 'from-rose-500 to-rose-600',
		stats: { users: 'Active', rating: '⭐' },
	},
	{
		title: 'GameSpot Booking Website',
		category: 'Web App',
		description:
			'Modern booking platform for GameSpot allowing customers to reserve gaming slots, view availability, and manage bookings online.',
		tags: ['React', 'Node.js', 'Booking System'],
		image: '/assets/images/gamespot-booking.png',
		color: 'from-slate-600 to-slate-700',
		stats: { users: 'Live', rating: '⭐' },
	},
];

const categories = ['All', 'Web App', 'Automation'];

const ProjectCard: React.FC<{
	project: typeof projects[0];
	index: number;
	inView: boolean;
}> = ({ project, index, inView }) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<motion.div
			initial={{ opacity: 0, y: 60, scale: 0.9 }}
			animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
			transition={{
				duration: 0.8,
				delay: index * 0.2,
				type: 'spring',
				stiffness: 80,
			}}
			exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
			layout
			className="group relative"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<motion.div
				className="relative h-[160px] sm:h-[180px] md:h-[200px] lg:h-[240px] xl:h-[280px] 2xl:h-[320px] rounded-lg sm:rounded-xl overflow-hidden cursor-pointer"
				whileHover={{ y: -8, scale: 1.02 }}
				transition={{ type: 'spring', stiffness: 300, damping: 20 }}
			>
				{/* Image */}
				<motion.div
					className="absolute inset-0"
					animate={{ scale: isHovered ? 1.05 : 1 }}
					transition={{ duration: 0.6 }}
				>
					<img
						src={project.image}
						alt={project.title}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
					<motion.div
						className={`absolute inset-0 bg-gradient-to-br ${project.color} mix-blend-overlay`}
						animate={{ opacity: isHovered ? 0.4 : 0.1 }}
						transition={{ duration: 0.3 }}
					/>
				</motion.div>

				{/* Border */}
				<motion.div
					className="absolute inset-0 rounded-xl pointer-events-none"
					animate={{
						boxShadow: isHovered
							? '0 20px 40px rgba(71, 85, 105, 0.12), inset 0 0 0 1px rgba(71, 85, 105, 0.2)'
							: '0 8px 20px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.05)',
					}}
					transition={{ duration: 0.3 }}
				/>

				{/* Content */}
				<div className="absolute inset-0 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between">
					{/* Top */}
					<div className="flex items-start justify-between">
						<motion.span
							className="px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-semibold backdrop-blur-md bg-white/50 border border-white/60 text-slate-600 shadow-sm"
							animate={{ scale: isHovered ? 1.05 : 1 }}
						>
							{project.category}
						</motion.span>

						<motion.div
							className="flex gap-1.5 sm:gap-2"
							initial={{ opacity: 0 }}
							animate={{ opacity: isHovered ? 1 : 0 }}
						>
							<div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-sm shadow-sm">
								<svg
									className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-500"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
								</svg>
								<span className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-700 font-medium">
									{project.stats.users}
								</span>
							</div>
							<div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-sm shadow-sm">
								<svg
									className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
								<span className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-700 font-medium">
									{project.stats.rating}
								</span>
							</div>
						</motion.div>
					</div>

					{/* Bottom */}
					<div>
						<motion.h3
							className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white mb-0.5 sm:mb-1 drop-shadow-md"
							animate={{ y: isHovered ? -4 : 0 }}
						>
							{project.title}
						</motion.h3>

						<AnimatePresence>
							{isHovered && (
								<motion.p
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									className="text-white/90 text-[10px] sm:text-xs md:text-sm mb-1.5 sm:mb-2 leading-relaxed drop-shadow-sm font-medium"
								>
									{project.description}
								</motion.p>
							)}
						</AnimatePresence>

						<div className="flex flex-wrap gap-1 sm:gap-1.5">
							{project.tags.map((tag, i) => (
								<motion.span
									key={i}
									className="px-1.5 sm:px-2 py-0.5 rounded-md text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-medium backdrop-blur-sm bg-black/40 border border-white/20 text-white"
									animate={{
										borderColor: isHovered
											? 'rgba(225, 29, 72, 0.4)'
											: 'rgba(255, 255, 255, 0.2)',
										backgroundColor: isHovered
											? 'rgba(225, 29, 72, 0.3)'
											: 'rgba(0, 0, 0, 0.4)',
									}}
									transition={{ delay: i * 0.05 }}
								>
									{tag}
								</motion.span>
							))}
						</div>
					</div>

					{/* View button */}
					<motion.div
						className="absolute bottom-3 sm:bottom-4 md:bottom-5 right-3 sm:right-4 md:right-5"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{
							opacity: isHovered ? 1 : 0,
							scale: isHovered ? 1 : 0.8,
						}}
					>
						<motion.button
							className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-800 shadow-lg shadow-slate-500/30"
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
						>
							<svg
								className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 8l4 4m0 0l-4 4m4-4H3"
								/>
							</svg>
						</motion.button>
					</motion.div>
				</div>

				{/* Shine */}
				<motion.div
					className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full pointer-events-none"
					animate={{ translateX: isHovered ? '200%' : '-100%' }}
					transition={{ duration: 0.7 }}
				/>
			</motion.div>
		</motion.div>
	);
};

const Projects: React.FC = () => {
	const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
	const [headerRef, headerInView] = useInView({ threshold: 0.3, triggerOnce: true });
	const [activeCategory, setActiveCategory] = useState('All');

	const filteredProjects =
		activeCategory === 'All'
			? projects
			: projects.filter((p) => p.category === activeCategory);

	return (
		<section className="relative w-full h-full flex items-center overflow-hidden bg-transparent py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12">
			{/* Nebula backgrounds - static */}
			<div className="absolute inset-0 overflow-hidden z-[5] pointer-events-none">
				<div className="absolute top-1/3 left-1/4 w-[200px] sm:w-[300px] md:w-[350px] lg:w-[400px] xl:w-[500px] h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[500px] bg-slate-500/5 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] lg:blur-[120px] opacity-30" />
				<div className="absolute bottom-1/4 right-1/3 w-[160px] sm:w-[250px] md:w-[300px] lg:w-[350px] xl:w-[450px] h-[160px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[450px] bg-slate-500/5 rounded-full blur-[50px] sm:blur-[70px] md:blur-[80px] lg:blur-[100px] opacity-25" />
			</div>

			{/* Content */}
			<div className="container mx-auto px-3 sm:px-5 md:px-6 lg:px-6 xl:px-8 relative z-20 max-w-4xl lg:max-w-5xl xl:max-w-6xl">
				{/* Header */}
				<motion.div
					ref={headerRef}
					className="text-center mb-5 sm:mb-6 md:mb-8 lg:mb-10"
				>
					<motion.span
						initial={{ opacity: 0, scale: 0.8, y: 20 }}
						animate={
							headerInView ? { opacity: 1, scale: 1, y: 0 } : {}
						}
						transition={{
							duration: 0.6,
							type: 'spring',
							stiffness: 100,
						}}
						className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-medium mb-2 sm:mb-3 md:mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-500"
					>
						<motion.div
							className="w-1.5 h-1.5 rounded-full bg-rose-500"
							animate={{
								scale: [1, 1.5, 1],
								opacity: [1, 0.5, 1],
							}}
							transition={{ duration: 2, repeat: Infinity }}
						/>
						Our Work
					</motion.span>

					<motion.h2
						initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
						animate={
							headerInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}
						}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-dark-900 mb-1.5 sm:mb-2 md:mb-3"
					>
						Featured{' '}
						<motion.span
							className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-600 inline-block"
							initial={{ opacity: 0, x: 20 }}
							animate={headerInView ? { opacity: 1, x: 0 } : {}}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							Projects
						</motion.span>
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={headerInView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="text-dark-500 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed max-w-md lg:max-w-xl mx-auto"
					>
						A showcase of our recent digital creations that drive results
					</motion.p>
				</motion.div>

				{/* Category Filter */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={headerInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6, delay: 0.5 }}
					className="flex flex-wrap justify-center gap-1.5 sm:gap-1.5 md:gap-2 mb-4 sm:mb-5 md:mb-6 lg:mb-8 px-2"
				>
					{categories.map((category, i) => (
						<motion.button
							key={category}
							onClick={() => setActiveCategory(category)}
							className="relative px-3 sm:px-2.5 md:px-3 lg:px-4 py-1 sm:py-1 md:py-1.5 rounded-full text-[10px] sm:text-[10px] md:text-xs lg:text-sm font-medium transition-colors"
							initial={{ opacity: 0, y: 20 }}
							animate={headerInView ? { opacity: 1, y: 0 } : {}}
							transition={{
								duration: 0.4,
								delay: 0.5 + i * 0.1,
							}}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.98 }}
						>
							{activeCategory === category && (
								<motion.div
									layoutId="activeCategory"
									className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-500/10 to-slate-600/10 border border-slate-500/30"
									transition={{
										type: 'spring',
										stiffness: 400,
										damping: 30,
									}}
								/>
							)}
							<span
								className={`relative z-10 ${
									activeCategory === category
										? 'text-slate-700'
										: 'text-dark-500 hover:text-dark-900'
								}`}
							>
								{category}
							</span>
						</motion.button>
					))}
				</motion.div>

				{/* Projects grid */}
				<div ref={ref} className="max-w-5xl xl:max-w-6xl mx-auto">
					<motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8" layout>
						<AnimatePresence mode="popLayout">
							{filteredProjects.map((project, index) => (
								<ProjectCard
									key={project.title}
									project={project}
									index={index}
									inView={inView}
								/>
							))}
						</AnimatePresence>
					</motion.div>

					{/* CTA */}
					<motion.div
						initial={{ opacity: 0, y: 40, scale: 0.95 }}
						animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
						transition={{
							duration: 0.8,
							delay: 0.6,
							type: 'spring',
							stiffness: 80,
						}}
						className="mt-6 sm:mt-10 md:mt-12 text-center"
					>
						<motion.a
							href="#contact"
							className="inline-flex items-center gap-1.5 sm:gap-3 px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3 md:py-4 rounded-full text-[10px] sm:text-sm md:text-base font-semibold text-dark-800 bg-white/50 border border-dark-900/10 group hover:border-rose-500/30 transition-all"
							whileHover={{
								scale: 1.05,
								boxShadow: '0 10px 40px rgba(244, 63, 94, 0.15)',
							}}
							whileTap={{ scale: 0.98 }}
						>
							<span>Want to see more?</span>
							<span className="text-rose-500">Get in touch</span>
							<motion.svg
								className="w-3 h-3 sm:w-4 sm:h-4 text-rose-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								animate={{ x: [0, 4, 0] }}
								transition={{ duration: 1.5, repeat: Infinity }}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 8l4 4m0 0l-4 4m4-4H3"
								/>
							</motion.svg>
						</motion.a>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default Projects;
