import setuptools
from glob import glob

setuptools.setup(
    name="simplest-notebook",
    version='0.0.4',
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
    zip_safe=False
)
