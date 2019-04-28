import setuptools
from distutils.command.build import build
from distutils.command.sdist import sdist
from setuptools.command.develop import develop
from glob import glob
import subprocess
import os

HERE = os.path.abspath(os.path.dirname(__file__))

def build_static_first(cls):
    """
    Return a command that builds static assets before calling command Cls
    """
    class Command(cls):
        def run(self):
            command = [
                "npm", "run", "build"
            ]
            subprocess.check_call(command, cwd=HERE)
            super().run()

    return Command


setuptools.setup(
    name="simplest-notebook",
    version='0.0.6',
    url="https://github.com/yuvipanda/simplest-notebook",
    author="Yuvi Panda",
    author_email="yuvipanda@gmail.com",
    license="BSD 3-Clause",
    packages=setuptools.find_packages(),
    install_requires=['notebook'],
    python_requires='>=3.5',
    classifiers=[
        'Framework :: Jupyter',
    ],
    data_files=[
        ('etc/jupyter/jupyter_notebook_config.d', ['simplest_notebook/etc/jupyter_notebook_config.d/simplest-notebook-serverextension.json']),
    ],
    package_data={
        '': ['build/*', 'index.html']
    },
    zip_safe=False,
    cmdclass={
        "sdist": build_static_first(sdist),
        "build": build_static_first(build),
        "develop": build_static_first(develop),
    }
)
