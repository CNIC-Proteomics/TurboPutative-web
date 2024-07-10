
cat('** Start script: myMSEA.R\n')

# Constants

# Get command line arguments
args = commandArgs(trailingOnly = T)

infile = args[1] # "S:\\U_Proteomica\\UNIDAD\\Softwares\\MacrosRafa\\data\\Metabolomics\\PESA_Integromics\\TestServer\\GSEA\\jobs\\Mus_musculus-UniprotID-Treatment_A12_PBS"  #args[0]
gmtfile = args[2] # path to job_id
outfile = args[3] # "Mus_musculus" #args[1]

# Import libraries
library(fgsea)
library(jsonlite)


# Open json with rank info

cat('**\n')

cat('** Reading infile...\n')
df <- as.data.frame(fromJSON(infile))
df <- df[order(df$RankStat, decreasing = T),]

# Create vector with statistic
rankStat <- df$RankStat

# Enrichment with HALLMARK
cat('** Perform enrichment\n')

names(rankStat) <- df$ID

pathways <- gmtPathways(gmtfile)

fgseaRes <- fgsea(pathways, rankStat, maxSize=500, minSize=5)

out <- fgseaRes[fgseaRes$pval <= 0.1]
out <- out[order(out$pval)]

cat('** Write output file\n')
outJson <- toJSON(out)
fileConn<-file(outfile)
writeLines(outJson, fileConn)
close(fileConn)
