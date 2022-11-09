# Show-Me-the-Crime
 
The goal of this site is to keep Queenslanders informed on the dangers of their neighbourhood. However, bar charts, graphs and tables aren’t always very interesting or clear. That’s where 'Show Me the Crime'comes along. This website showcases crime statistics in a fun, vibrant and simple way. Using a complex algorithm, the website represents crime levels in Queensland LGAs using colourful, animated bubbles of varying sizes. Essentially, the bigger the bubble, the more prevelant the crime is.

## Different Pages on 'Show Me the Crime'
* Home Page
    * Features crime bubbles tailored to the user's LGA (if location permission is granted). However, there are NO filtering options
* About Page
    * Details the purpose of the site and includes links to the raw data set (where the crime statistics are being drawn from)
* Filter Page
    * Features crime bubbles WITH filtering options 
                * Ability to filter by LGA
                * Option to compare two different LGAs via split-screen GUI


## What do the bubbles mean?
The bubbles represent crimes per 100 000 persons. For example, if there are 582 Offences Against Property, then 582 in 100 000 persons have committed this offence.

## Where is the data from?
The integrated data is from the Queensland Police Service. In particular, reported offence rates per 100,000 persons (population) by Local Government Area (LGA) and crime type. This is retrieved using an API from [data.gov.au](https://data.gov.au/). 
