from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in time_tracker/__init__.py
from time_tracker import __version__ as version

setup(
	name="time_tracker",
	version=version,
	description="Tracks time ,activity of the selection doctypes",
	author="Aerele Technologies",
	author_email="dhinesh@aerele.in",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)