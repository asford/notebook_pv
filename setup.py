#!/usr/bin/env python
# -*- coding: utf-8 -*-
from setuptools import (
    setup,
    find_packages,
)

try:
    from jupyterpip import cmdclass
except:
    import importlib
    import pip
    pip.main(['install', 'jupyter-pip'])
    cmdclass = importlib.import_module('jupyterpip').cmdclass


# load version without side-effects
__version__ = None
with open('notebook_pv/version.py') as f:
    exec(f.read())


setup(
    name='notebook_pv',
    version=__version__,
    description='Bio-pv integration for IPython notebooks.',
    long_description="",
    author='Alex Ford',
    author_email='a.sewall.ford@gmail.com',
    url='https://github.com/asford/notebook_pv',
    packages=find_packages(include=['notebook_pv']),
    include_package_data=True,
    license='BSD',
    zip_safe=False,
    keywords='notebook_pv ipython',
    classifiers=[
        'Development Status :: 2 - Pre-Alpha',
        'Framework :: IPython',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Natural Language :: English',
        'Programming Language :: Python :: 2.6',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3',
        'Topic :: Software Development :: Widget Sets',
        "Programming Language :: Python :: 2",
    ],
    tests_require=[
        "nose",
    ],
    setup_requires=[
        "IPython>=3.0.0,<4.0.0",
        "requests",
    ],
    install_requires=[
        "IPython>=3.0.0,<4.0.0",
    ],
    test_suite='nose.collector',
    cmdclass=cmdclass('notebook_pv/static/notebook_pv')
)
